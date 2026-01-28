# Part 3: Authentication & Security

> Rice Mill SaaS Platform - Authentication, Authorization & Security

---

## 1. Authentication Overview

### Authentication Strategy

- **Primary Method**: JWT (JSON Web Tokens) with separate **Access** and **Refresh** tokens
- **Passport.js**: For flexible authentication strategies
- **Token Rotation**: Refresh tokens are rotated on each use for enhanced security
- **Multi-Device Support**: Users can login from multiple devices

### Token Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TWO-TOKEN SYSTEM                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────┐         ┌────────────────────────┐  │
│  │   ACCESS TOKEN        │         │   REFRESH TOKEN        │  │
│  ├───────────────────────┤         ├────────────────────────┤  │
│  │ Lifetime: 15 minutes  │         │ Lifetime: 7 days       │  │
│  │ Storage: Memory       │         │ Storage: Database      │  │
│  │ Secret: ACCESS_SECRET │         │ Secret: REFRESH_SECRET │  │
│  │ Purpose: API access   │         │ Purpose: Token renewal │  │
│  └───────────────────────┘         └────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Why separate secrets?
- If access token is compromised → limited 15-minute exposure
- If refresh token is compromised → can revoke from database
- Different secrets prevent cross-token forgery attacks
```

---

## 2. Passport.js Configuration

### 2.1 JWT Access Token Strategy

```javascript
// src/modules/auth/strategies/jwt.strategy.js
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('../../../config');
const User = require('../../../shared/models/user.model');

// Access Token Strategy (for API requests)
const accessTokenStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.auth.accessTokenSecret,
    algorithms: ['HS256'],
    issuer: 'rice-mill-api',
    audience: 'rice-mill-client',
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.sub)
        .populate('millId', 'name code status')
        .lean();

      if (!user || !user.isActive) {
        return done(null, false, { message: 'User not found or inactive' });
      }

      // Attach user to request
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

module.exports = { accessTokenStrategy };
```

### 2.2 JWT Refresh Token Strategy

```javascript
// src/modules/auth/strategies/jwt-refresh.strategy.js
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('../../../config');
const RefreshToken = require('../../../shared/models/refresh-token.model');

// Refresh Token Strategy (for token renewal)
const refreshTokenStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
    secretOrKey: config.auth.refreshTokenSecret,
    algorithms: ['HS256'],
    passReqToCallback: true,
  },
  async (req, payload, done) => {
    try {
      const refreshToken = req.body.refreshToken;

      const storedToken = await RefreshToken.findOne({
        token: refreshToken,
        isRevoked: false,
      }).populate('userId');

      if (!storedToken) {
        return done(null, false, { message: 'Invalid refresh token' });
      }

      if (new Date() > storedToken.expiresAt) {
        return done(null, false, { message: 'Refresh token expired' });
      }

      return done(null, storedToken.userId);
    } catch (error) {
      return done(error, false);
    }
  }
);

module.exports = { refreshTokenStrategy };
```

### 2.3 Local Strategy (Email/Password)

```javascript
// src/modules/auth/strategies/local.strategy.js
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../../../shared/models/user.model');

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() })
        .select('+password') // Include password field
        .populate('millId');

      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      if (!user.isActive) {
        return done(null, false, { message: 'Account is deactivated' });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Remove password from user object before returning
      const userObject = user.toObject();
      delete userObject.password;

      return done(null, userObject);
    } catch (error) {
      return done(error, false);
    }
  }
);

module.exports = { localStrategy };
```

### 2.4 Passport Initialization

```javascript
// src/config/passport.js
const passport = require('passport');
const { accessTokenStrategy } = require('../modules/auth/strategies/jwt.strategy');
const { refreshTokenStrategy } = require('../modules/auth/strategies/jwt-refresh.strategy');
const { localStrategy } = require('../modules/auth/strategies/local.strategy');

// Configure strategies
passport.use('jwt-access', accessTokenStrategy);
passport.use('jwt-refresh', refreshTokenStrategy);
passport.use('local', localStrategy);

module.exports = passport;
```

---

## 3. Token Service

### Complete Token Management

```javascript
// src/modules/auth/services/token.service.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../../config');
const RefreshToken = require('../../../shared/models/refresh-token.model');

class TokenService {
  /**
   * Generate short-lived access token (15 minutes)
   * Used for API authentication
   */
  generateAccessToken(user) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      millId: user.millId ? user.millId.toString() : null,
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, config.auth.accessTokenSecret, {
      expiresIn: config.auth.accessTokenExpiresIn, // '15m'
      algorithm: 'HS256',
      issuer: 'rice-mill-api',
      audience: 'rice-mill-client',
    });
  }

  /**
   * Generate long-lived refresh token (7 days)
   * Stored in database, used for token renewal
   */
  async generateRefreshToken(user, deviceInfo = null, ipAddress = null) {
    // Generate cryptographically secure random token
    const token = crypto.randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Store in database
    await RefreshToken.create({
      token,
      userId: user._id,
      deviceInfo,
      ipAddress,
      expiresAt,
      isRevoked: false,
    });

    return token;
  }

  /**
   * Verify and decode access token
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.auth.accessTokenSecret, {
        algorithms: ['HS256'],
        issuer: 'rice-mill-api',
        audience: 'rice-mill-client',
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Revoke a single refresh token (logout from one device)
   */
  async revokeRefreshToken(token) {
    await RefreshToken.updateOne({ token }, { isRevoked: true });
  }

  /**
   * Revoke all user's refresh tokens (logout from all devices)
   */
  async revokeAllUserTokens(userId) {
    await RefreshToken.updateMany({ userId, isRevoked: false }, { isRevoked: true });
  }

  /**
   * Clean up expired and revoked tokens (run via cron job)
   */
  async cleanupExpiredTokens() {
    const result = await RefreshToken.deleteMany({
      $or: [{ expiresAt: { $lt: new Date() } }, { isRevoked: true }],
    });
    return result.deletedCount;
  }

  /**
   * Get user's active sessions
   */
  async getUserSessions(userId) {
    return await RefreshToken.find({
      userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    })
      .select('deviceInfo ipAddress createdAt expiresAt')
      .sort({ createdAt: -1 });
  }
}

module.exports = new TokenService();
```

---

## 4. Authentication Service

### Auth Business Logic

```javascript
// src/modules/auth/services/auth.service.js
const User = require('../../../shared/models/user.model');
const tokenService = require('./token.service');
const { UnauthorizedError, ConflictError } = require('../../../shared/utils/api-error');
const logger = require('../../../shared/utils/logger');

class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(email, password, deviceInfo, ipAddress) {
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('millId', 'name code status');

    if (!user) {
      logger.warn(`Failed login attempt for email: ${email}`);
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      logger.warn(`Login attempt for inactive user: ${email}`);
      throw new UnauthorizedError('Account is deactivated');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      logger.warn(`Invalid password attempt for user: ${email}`);
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login timestamp
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = await tokenService.generateRefreshToken(user, deviceInfo, ipAddress);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`User logged in successfully: ${user.email}`);

    return {
      user: userResponse,
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  /**
   * Register new user
   */
  async signUp(userData) {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const user = await User.create({
      ...userData,
      email: userData.email.toLowerCase(),
    });

    logger.info(`New user registered: ${user.email}`);

    return user.toPublicJSON();
  }

  /**
   * Refresh access token using refresh token
   * Implements token rotation for security
   */
  async refreshToken(refreshToken, deviceInfo, ipAddress) {
    const RefreshToken = require('../../../shared/models/refresh-token.model');

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
    }).populate('userId');

    if (!storedToken) {
      logger.warn('Refresh token not found or revoked');
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (new Date() > storedToken.expiresAt) {
      logger.warn('Expired refresh token used');
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = storedToken.userId;

    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Token Rotation: Revoke old token
    await tokenService.revokeRefreshToken(refreshToken);

    // Generate new tokens
    const newAccessToken = tokenService.generateAccessToken(user);
    const newRefreshToken = await tokenService.generateRefreshToken(user, deviceInfo, ipAddress);

    logger.info(`Tokens refreshed for user: ${user.email}`);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900,
    };
  }

  /**
   * Logout from current device
   */
  async logout(refreshToken) {
    await tokenService.revokeRefreshToken(refreshToken);
    logger.info('User logged out from device');
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId) {
    await tokenService.revokeAllUserTokens(userId);
    logger.info(`User logged out from all devices: ${userId}`);
  }

  /**
   * Get user's active sessions
   */
  async getUserSessions(userId) {
    return await tokenService.getUserSessions(userId);
  }
}

module.exports = new AuthService();
```

---

## 5. Role-Based Authorization

### Authorization Middleware

```javascript
// src/modules/auth/middlewares/authorize.js
const { ForbiddenError } = require('../../../shared/utils/api-error');
const { USER_ROLES } = require('../../../shared/constants');

/**
 * Permission definitions
 * Each permission specifies:
 * - roles: Array of roles that have this permission
 * - millAccess: 'own' means user can only access their own mill's data
 */
const PERMISSIONS = {
  // ========== SUPER ADMIN ONLY ==========
  'admin:mills:create': { roles: [USER_ROLES.SUPER_ADMIN] },
  'admin:mills:read': { roles: [USER_ROLES.SUPER_ADMIN] },
  'admin:mills:update': { roles: [USER_ROLES.SUPER_ADMIN] },
  'admin:mills:delete': { roles: [USER_ROLES.SUPER_ADMIN] },
  'admin:users:manage': { roles: [USER_ROLES.SUPER_ADMIN] },
  'admin:subscriptions:manage': { roles: [USER_ROLES.SUPER_ADMIN] },
  'admin:platform:stats': { roles: [USER_ROLES.SUPER_ADMIN] },

  // ========== MILL ADMIN ==========
  'mill:staff:create': { roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN], millAccess: 'own' },
  'mill:staff:read': { roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN], millAccess: 'own' },
  'mill:staff:update': { roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN], millAccess: 'own' },
  'mill:staff:delete': { roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN], millAccess: 'own' },
  
  'mill:financial:read': { roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN], millAccess: 'own' },
  'mill:financial:write': { roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN], millAccess: 'own' },
  
  'mill:reports:read': { roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN], millAccess: 'own' },
  'mill:reports:export': { roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN], millAccess: 'own' },

  // ========== MILL STAFF (COMMON) ==========
  'mill:purchase:read': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },
  'mill:purchase:create': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },
  'mill:purchase:update': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },

  'mill:sale:read': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },
  'mill:sale:create': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },
  'mill:sale:update': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },

  'mill:stock:read': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },

  'mill:masters:read': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },
  'mill:masters:write': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },

  'mill:dashboard:read': {
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MILL_ADMIN, USER_ROLES.MILL_STAFF],
    millAccess: 'own',
  },
};

/**
 * Authorization middleware
 * Usage: authorize('mill:purchase:create', 'mill:purchase:read')
 */
const authorize = (...permissions) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ForbiddenError('Access denied: User not authenticated');
    }

    // Super Admin bypass - has all permissions
    if (user.role === USER_ROLES.SUPER_ADMIN) {
      return next();
    }

    // Check each permission
    let hasPermission = false;

    for (const permission of permissions) {
      const config = PERMISSIONS[permission];

      if (!config) {
        continue; // Unknown permission, skip
      }

      // Check if user's role has this permission
      if (!config.roles.includes(user.role)) {
        continue;
      }

      // Check mill access restriction
      if (config.millAccess === 'own') {
        const millId = req.params.millId || req.body.millId;
        const userMillId = user.millId ? user.millId.toString() : null;

        if (millId && userMillId !== millId) {
          throw new ForbiddenError('Access denied: You can only access your own mill data');
        }
      }

      hasPermission = true;
      break;
    }

    if (!hasPermission) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
};

/**
 * Check if user has specific role
 * Usage: requireRole(USER_ROLES.MILL_ADMIN)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ForbiddenError('Access denied: User not authenticated');
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenError(`Access denied: Requires one of roles: ${roles.join(', ')}`);
    }

    next();
  };
};

module.exports = { authorize, requireRole, PERMISSIONS };
```

---

## 6. Security Middleware

### 6.1 Helmet (HTTP Headers)

```javascript
// src/shared/middlewares/security.js
const helmet = require('helmet');

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
});

module.exports = { helmetConfig };
```

### 6.2 CORS Configuration

```javascript
// src/shared/middlewares/cors.js
const cors = require('cors');
const config = require('../../config');

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = config.cors.allowedOrigins || ['http://localhost:5173'];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
};

module.exports = cors(corsOptions);
```

### 6.3 Rate Limiting

```javascript
// src/shared/middlewares/rate-limiter.js
const rateLimit = require('express-rate-limit');
const config = require('../../config');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.rateLimit.max || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true,
});

module.exports = { apiLimiter, authLimiter };
```

### 6.4 MongoDB Sanitization

```javascript
// src/shared/middlewares/sanitize.js
const mongoSanitize = require('express-mongo-sanitize');

// Prevent NoSQL injection
const sanitizeMiddleware = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized field: ${key}`);
  },
});

module.exports = { sanitizeMiddleware };
```

---

## 7. Auth Routes

```javascript
// src/modules/auth/routes/auth.routes.js
const { Router } = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../../../shared/middlewares/validate-request');
const { authLimiter } = require('../../../shared/middlewares/rate-limiter');
const {
  signInSchema,
  signUpSchema,
  refreshTokenSchema,
} = require('../validators/auth.validator');

const router = Router();

// ========== PUBLIC ROUTES ==========
router.post('/sign-in', authLimiter, validateRequest(signInSchema), authController.signIn);
router.post('/sign-up', validateRequest(signUpSchema), authController.signUp);
router.post('/refresh-token', validateRequest(refreshTokenSchema), authController.refreshToken);

// ========== PROTECTED ROUTES ==========
router.use(passport.authenticate('jwt-access', { session: false }));

router.post('/logout', authController.logout);
router.post('/logout-all', authController.logoutAll);
router.get('/me', authController.me);
router.get('/sessions', authController.getSessions);

module.exports = router;
```

---

## 8. Zod Validators

```javascript
// src/modules/auth/validators/auth.validator.js
const { z } = require('zod');

const signInSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const signUpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'MILL_ADMIN', 'MILL_STAFF']).optional(),
    millId: z.string().optional(),
  }),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

module.exports = {
  signInSchema,
  signUpSchema,
  refreshTokenSchema,
};
```

---

## 9. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SIGN IN FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

Client                    Server                      Database
  │                         │                            │
  │ POST /auth/sign-in      │                            │
  │ {email, password}       │                            │
  │────────────────────────>│                            │
  │                         │                            │
  │                         │ Find user by email         │
  │                         │───────────────────────────>│
  │                         │<───────────────────────────│
  │                         │                            │
  │                         │ bcrypt.compare(password)   │
  │                         │                            │
  │                         │ Generate Access Token      │
  │                         │ (JWT, 15min, ACCESS_SECRET)│
  │                         │                            │
  │                         │ Generate Refresh Token     │
  │                         │ (crypto random, 7 days)    │
  │                         │───────────────────────────>│
  │                         │ Store in refresh_tokens    │
  │                         │                            │
  │ {user, accessToken,     │                            │
  │  refreshToken}          │                            │
  │<────────────────────────│                            │
  │                         │                            │

Client stores:
- accessToken → Memory (axios interceptor)
- refreshToken → httpOnly cookie or localStorage (secure)

┌─────────────────────────────────────────────────────────────────────┐
│                      TOKEN REFRESH FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

Client                    Server                      Database
  │                         │                            │
  │ POST /auth/refresh-token│                            │
  │ {refreshToken}          │                            │
  │────────────────────────>│                            │
  │                         │                            │
  │                         │ Validate refresh token     │
  │                         │───────────────────────────>│
  │                         │<───────────────────────────│
  │                         │                            │
  │                         │ Revoke old token           │
  │                         │───────────────────────────>│
  │                         │                            │
  │                         │ Generate NEW tokens        │
  │                         │ (Token Rotation)           │
  │                         │───────────────────────────>│
  │                         │                            │
  │ {accessToken,           │                            │
  │  refreshToken}          │                            │
  │<────────────────────────│                            │
  │                         │                            │
```

---

## 10. Security Best Practices

### Implemented Security Measures

| Security Feature          | Implementation                                  |
| ------------------------- | ----------------------------------------------- |
| Password Hashing          | bcrypt with 12 rounds                           |
| JWT Signing               | HS256 algorithm with separate secrets           |
| Token Expiry              | Access: 15min, Refresh: 7 days                  |
| Token Rotation            | Refresh tokens rotated on each use              |
| HTTPS Only                | Enforced in production                          |
| Helmet                    | HTTP security headers                           |
| CORS                      | Whitelist allowed origins                       |
| Rate Limiting             | 100 req/15min (API), 5 req/15min (auth)         |
| NoSQL Injection           | express-mongo-sanitize                          |
| Input Validation          | Zod schemas                                     |
| Error Handling            | No sensitive data in error responses            |
| Audit Logging             | Winston logger for security events              |
| Multi-Device Logout       | Revoke all refresh tokens                       |
| Session Management        | Track active sessions per user                  |

---

## Next Steps

Continue to:
- [Part 4: API Modules](./implementation-part-4-api-modules.md) - API endpoints and controllers
- [Part 5: Real-Time Features](./implementation-part-5-realtime-features.md) - Socket.io implementation
