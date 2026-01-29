# Backend Implementation Plan

## Overview

Express.js backend with MongoDB, ES modules (JavaScript), cookie-based authentication using Passport.js, and role-based access control (RBAC) with granular permissions for mill staff.

**Architecture:**
- **REST API** - Authentication only (login, register, logout, refresh, Google OAuth)
- **Socket.IO** - All other operations (admin, mill, staff data operations)

---

## 1. Project Structure

```
server/
├── src/
│   ├── index.js                    # Entry point
│   ├── app.js                      # Express app setup
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── passport.js             # Passport strategies
│   │   ├── cookie.js               # Cookie configuration
│   │   └── env.js                  # Environment variables
│   ├── models/
│   │   ├── User.js                 # User model (all roles)
│   │   ├── Mill.js                 # Mill model
│   │   ├── RefreshToken.js         # Refresh token storage
│   │   └── index.js                # Model exports
│   ├── controllers/
│   │   └── authController.js       # Auth logic (REST API)
│   ├── middlewares/
│   │   ├── auth.js                 # JWT cookie verification
│   │   ├── roleGuard.js            # Role-based access
│   │   ├── permissionGuard.js      # Permission-based access
│   │   ├── errorHandler.js         # Global error handler
│   │   └── validate.js             # Zod validation middleware
│   ├── routes/
│   │   ├── index.js                # Route aggregator
│   │   └── authRoutes.js           # /auth/* (REST API only)
│   ├── socket/
│   │   ├── index.js                # Socket.IO setup & authentication
│   │   ├── adminHandlers.js        # Super admin socket handlers
│   │   ├── millHandlers.js         # Mill admin socket handlers
│   │   └── staffHandlers.js        # Mill staff socket handlers
│   ├── services/
│   │   ├── tokenService.js         # JWT generation/verification
│   │   ├── authService.js          # Auth business logic
│   │   └── googleAuthService.js    # Google OAuth logic
│   ├── validators/
│   │   ├── authValidators.js       # Auth input schemas
│   │   ├── userValidators.js       # User input schemas
│   │   └── millValidators.js       # Mill input schemas
│   ├── utils/
│   │   ├── ApiResponse.js          # Standardized responses
│   │   ├── ApiError.js             # Custom error class
│   │   └── logger.js               # Winston logger
│   └── scripts/
│       └── seed-admin.js           # Super admin seeder
├── .env
├── .env.example
├── package.json
└── nodemon.json
```

---

## 2. Data Models

### 2.1 User Model

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required for local auth),
  name: String (required),
  phone: String,
  avatar: String,
  role: Enum ['super-admin', 'mill-admin', 'mill-staff'] (required),
  millId: ObjectId (ref: Mill, required for mill-admin & mill-staff),
  
  // For mill-staff only - assigned by mill-admin
  permissions: [String], // e.g., ['purchases.read', 'sales.create', 'reports.view']
  
  // Google OAuth
  googleId: String,
  
  // Status
  isActive: Boolean (default: true),
  lastLogin: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId (ref: User)
}
```

### 2.2 Mill Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  code: String (unique, required), // e.g., "MILL001"
  address: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
  email: String,
  gstNumber: String,
  panNumber: String,
  
  status: Enum ['active', 'inactive', 'suspended', 'pending'] (default: 'pending'),
  
  // Subscription
  subscriptionPlan: Enum ['basic', 'professional', 'enterprise'],
  subscriptionExpiresAt: Date,
  
  // Owner (the mill-admin who owns this mill)
  ownerId: ObjectId (ref: User),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId (ref: User) // super-admin who created
}
```

### 2.3 RefreshToken Model

```javascript
{
  _id: ObjectId,
  token: String (hashed, unique),
  userId: ObjectId (ref: User, required),
  expiresAt: Date (required),
  isRevoked: Boolean (default: false),
  userAgent: String,
  ipAddress: String,
  createdAt: Date
}
```

---

## 3. Authentication Architecture

### 3.1 Token Strategy (Cookie-Only)

| Token | Storage | Lifetime | HttpOnly | Secure | SameSite |
|-------|---------|----------|----------|--------|----------|
| Access Token | Cookie `access_token` | 15 minutes | ✅ | ✅ (prod) | Strict |
| Refresh Token | Cookie `refresh_token` | 7 days | ✅ | ✅ (prod) | Strict |

### 3.2 Passport Strategies

1. **passport-local** - Email/password authentication
2. **passport-google-oauth20** - Google OAuth 2.0
3. **passport-jwt** - JWT verification with custom cookie extractor

### 3.3 Cookie Extractor (for passport-jwt)

```javascript
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};
```

---

## 4. REST API Endpoints (Authentication Only)

### 4.1 Auth Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/login` | Login with email/password | Public |
| POST | `/register` | Register new user | Public (or restricted) |
| POST | `/google/login` | Google OAuth (token verification) | Public |
| GET | `/google` | Google OAuth redirect | Public |
| GET | `/google/callback` | Google OAuth callback | Public |
| POST | `/refresh` | Refresh access token | Public (with refresh cookie) |
| POST | `/logout` | Logout (clear cookies) | Authenticated |
| GET | `/me` | Get current user | Authenticated |
| PUT | `/profile` | Update profile | Authenticated |
| POST | `/change-password` | Change password | Authenticated |

---

## 5. Socket.IO Events

### 5.1 Socket Authentication

```javascript
// Client connects with cookies (access_token)
io.use(async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    const token = parseCookies(cookies)['access_token'];
    
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return next(new Error('User not found or inactive'));
    }
    
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});
```

### 5.2 Super Admin Events

| Event (Emit) | Event (Response) | Description | Access |
|--------------|------------------|-------------|--------|
| `admin:mills:list` | `admin:mills:list:response` | List all mills | super-admin |
| `admin:mills:create` | `admin:mills:create:response` | Create new mill | super-admin |
| `admin:mills:get` | `admin:mills:get:response` | Get mill details | super-admin |
| `admin:mills:update` | `admin:mills:update:response` | Update mill | super-admin |
| `admin:mills:delete` | `admin:mills:delete:response` | Delete/suspend mill | super-admin |
| `admin:users:list` | `admin:users:list:response` | List all users | super-admin |
| `admin:mill-admins:create` | `admin:mill-admins:create:response` | Create mill admin | super-admin |
| `admin:users:status` | `admin:users:status:response` | Activate/deactivate user | super-admin |
| `admin:mill:dashboard` | `admin:mill:dashboard:response` | Get mill-admin dashboard (via mill-id) | super-admin |
| `admin:mill-staff:dashboard` | `admin:mill-staff:dashboard:response` | Get mill-staff dashboard (via mill-id) | super-admin |

### 5.3 Mill Admin Events

| Event (Emit) | Event (Response) | Description | Access |
|--------------|------------------|-------------|--------|
| `mill:dashboard` | `mill:dashboard:response` | Get mill dashboard | mill-admin |
| `mill:staff:list` | `mill:staff:list:response` | List mill staff | mill-admin |
| `mill:staff:create` | `mill:staff:create:response` | Create mill staff | mill-admin |
| `mill:staff:get` | `mill:staff:get:response` | Get staff details | mill-admin |
| `mill:staff:update` | `mill:staff:update:response` | Update staff | mill-admin |
| `mill:staff:delete` | `mill:staff:delete:response` | Delete staff | mill-admin |
| `mill:staff:permissions:update` | `mill:staff:permissions:update:response` | Update staff permissions | mill-admin |
| `mill:staff:permissions:get` | `mill:staff:permissions:get:response` | Get staff permissions | mill-admin |

### 5.4 Mill Staff Events

> **Note:** All staff events are automatically scoped to the staff member's assigned mill (via `User.millId`). Staff can only access data belonging to their mill.

| Event (Emit) | Event (Response) | Description | Permission |
|--------------|------------------|-------------|------------|
| `staff:dashboard` | `staff:dashboard:response` | Get staff dashboard | mill-staff |
| `staff:permissions` | `staff:permissions:response` | Get own permissions | mill-staff |
| `staff:purchases:list` | `staff:purchases:list:response` | List purchases | purchases.read |
| `staff:purchases:create` | `staff:purchases:create:response` | Create purchase | purchases.create |
| `staff:purchases:update` | `staff:purchases:update:response` | Update purchase | purchases.update |
| `staff:purchases:delete` | `staff:purchases:delete:response` | Delete purchase | purchases.delete |
| `staff:sales:list` | `staff:sales:list:response` | List sales | sales.read |
| `staff:sales:create` | `staff:sales:create:response` | Create sale | sales.create |
| `staff:sales:update` | `staff:sales:update:response` | Update sale | sales.update |
| `staff:sales:delete` | `staff:sales:delete:response` | Delete sale | sales.delete |
| `staff:inventory:get` | `staff:inventory:get:response` | View inventory | inventory.read |
| `staff:inventory:update` | `staff:inventory:update:response` | Manage inventory | inventory.manage |
| `staff:inward:list` | `staff:inward:list:response` | List inward entries | inward.read |
| `staff:inward:create` | `staff:inward:create:response` | Create inward entry | inward.create |
| `staff:inward:update` | `staff:inward:update:response` | Update inward entry | inward.update |
| `staff:inward:delete` | `staff:inward:delete:response` | Delete inward entry | inward.delete |
| `staff:outward:list` | `staff:outward:list:response` | List outward entries | outward.read |
| `staff:outward:create` | `staff:outward:create:response` | Create outward entry | outward.create |
| `staff:outward:update` | `staff:outward:update:response` | Update outward entry | outward.update |
| `staff:outward:delete` | `staff:outward:delete:response` | Delete outward entry | outward.delete |
| `staff:milling:list` | `staff:milling:list:response` | List milling entries | milling.read |
| `staff:milling:create` | `staff:milling:create:response` | Create milling entry | milling.create |
| `staff:milling:update` | `staff:milling:update:response` | Update milling entry | milling.update |
| `staff:milling:delete` | `staff:milling:delete:response` | Delete milling entry | milling.delete |
| `staff:financial:list` | `staff:financial:list:response` | List financial entries | financial.read |
| `staff:financial:create` | `staff:financial:create:response` | Create financial entry | financial.create |
| `staff:financial:update` | `staff:financial:update:response` | Update financial entry | financial.update |
| `staff:financial:delete` | `staff:financial:delete:response` | Delete financial entry | financial.delete |
| `staff:reports:daily` | `staff:reports:daily:response` | View daily reports | reports.daily |
| `staff:reports:transaction` | `staff:reports:transaction:response` | View transaction reports | reports.transaction |
| `staff:reports:input` | `staff:reports:input:response` | View input reports | reports.input |
| `staff:inputdata:parties:list` | `staff:inputdata:parties:list:response` | List parties | inputdata.parties |
| `staff:inputdata:parties:create` | `staff:inputdata:parties:create:response` | Create party | inputdata.parties |
| `staff:inputdata:brokers:list` | `staff:inputdata:brokers:list:response` | List brokers | inputdata.brokers |
| `staff:inputdata:brokers:create` | `staff:inputdata:brokers:create:response` | Create broker | inputdata.brokers |
| `staff:inputdata:transporters:list` | `staff:inputdata:transporters:list:response` | List transporters | inputdata.transporters |
| `staff:inputdata:transporters:create` | `staff:inputdata:transporters:create:response` | Create transporter | inputdata.transporters |
| `staff:inputdata:committees:list` | `staff:inputdata:committees:list:response` | List committees | inputdata.committees |
| `staff:inputdata:committees:create` | `staff:inputdata:committees:create:response` | Create committee | inputdata.committees |
| `staff:inputdata:vehicles:list` | `staff:inputdata:vehicles:list:response` | List vehicles | inputdata.vehicles |
| `staff:inputdata:vehicles:create` | `staff:inputdata:vehicles:create:response` | Create vehicle | inputdata.vehicles |
| `staff:inputdata:staff:list` | `staff:inputdata:staff:list:response` | View staff list | inputdata.staff |
| `staff:attendance:get` | `staff:attendance:get:response` | View attendance | attendance.read |
| `staff:attendance:mark` | `staff:attendance:mark:response` | Mark attendance | attendance.create |

### 5.5 Socket.IO Response Format

```javascript
// Success Response
socket.emit('event:response', {
  success: true,
  data: { ... },
  message: 'Operation successful'
});

// Error Response
socket.emit('event:response', {
  success: false,
  error: 'Error message',
  code: 'ERROR_CODE'
});
```

### 5.6 Socket.IO Server Setup (`src/socket/index.js`)

```javascript
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { adminHandlers } from './adminHandlers.js';
import { millHandlers } from './millHandlers.js';
import { staffHandlers } from './staffHandlers.js';

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      const token = parseCookies(cookies)?.access_token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }
      
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }
      
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.email}`);
    
    // Join room based on role
    if (socket.user.role === 'super-admin') {
      socket.join('super-admin');
      adminHandlers(io, socket);
    } else if (socket.user.role === 'mill-admin') {
      socket.join(`mill-admin:${socket.user.millId}`);
      millHandlers(io, socket);
    } else if (socket.user.role === 'mill-staff') {
      socket.join(`mill-staff:${socket.user.millId}`);
      staffHandlers(io, socket);
    }
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.email}`);
    });
  });

  return io;
};
```

---

## 6. Role-Based Access Control (RBAC)

### 6.1 Role Hierarchy

```
super-admin
    └── Can create/manage multiple mill-admins
    └── Can manage all mills
    └── Can access ALL mill-admin dashboards (via mill-id)
    └── Can access ALL mill-staff dashboards (via mill-id)
    └── Full system access

mill-admin
    └── Can own ONE or MULTIPLE mills (linked via Mill.ownerId)
    └── Can create/manage MULTIPLE mill-staff for each of their mills
    └── Can assign different permissions to each staff member
    └── Full access to all their mills' data

mill-staff
    └── Belongs to ONE mill (linked via User.millId)
    └── Multiple staff can belong to same mill
    └── Access based on individually assigned permissions
    └── Can only access data from their assigned mill
```

### 6.2 Mill-Staff Relationship

```
Mill (MILL001)
    ├── mill-admin (owner)
    ├── staff-1 (permissions: purchases.*, sales.read)
    ├── staff-2 (permissions: inventory.*, milling.*)
    ├── staff-3 (permissions: financial.*, reports.*)
    └── staff-N (permissions: ...)
```

**Key Points:**
- Each staff member is linked to a mill via `User.millId`
- Staff can only see/modify data belonging to their mill
- Mill-admin assigns permissions independently to each staff
- Different staff can have different permission sets

### 6.3 Permission System for Mill Staff

Mill admins can assign granular permissions to staff:

```javascript
const AVAILABLE_PERMISSIONS = {
  // Purchases
  'purchases.create': 'Create purchase entries',
  'purchases.read': 'View purchase reports',
  'purchases.update': 'Edit purchase entries',
  'purchases.delete': 'Delete purchase entries',
  
  // Sales
  'sales.create': 'Create sales entries',
  'sales.read': 'View sales reports',
  'sales.update': 'Edit sales entries',
  'sales.delete': 'Delete sales entries',
  
  // Inventory
  'inventory.read': 'View inventory',
  'inventory.manage': 'Manage inventory',
  
  // Inward
  'inward.create': 'Create inward entries',
  'inward.read': 'View inward reports',
  'inward.update': 'Edit inward entries',
  'inward.delete': 'Delete inward entries',
  
  // Outward
  'outward.create': 'Create outward entries',
  'outward.read': 'View outward reports',
  'outward.update': 'Edit outward entries',
  'outward.delete': 'Delete outward entries',
  
  // Milling
  'milling.create': 'Create milling entries',
  'milling.read': 'View milling reports',
  'milling.update': 'Edit milling entries',
  'milling.delete': 'Delete milling entries',
  
  // Financial
  'financial.create': 'Create financial entries',
  'financial.read': 'View financial reports',
  'financial.update': 'Edit financial entries',
  'financial.delete': 'Delete financial entries',
  
  // Reports
  'reports.daily': 'View daily reports',
  'reports.transaction': 'View transaction reports',
  'reports.input': 'View input reports',
  
  // Input Data
  'inputdata.parties': 'Manage parties',
  'inputdata.brokers': 'Manage brokers',
  'inputdata.transporters': 'Manage transporters',
  'inputdata.committees': 'Manage committees',
  'inputdata.vehicles': 'Manage vehicles',
  'inputdata.staff': 'View staff list',
  
  // Attendance
  'attendance.create': 'Mark attendance',
  'attendance.read': 'View attendance reports',
};
```

### 6.4 Middleware Implementation

```javascript
// Role guard
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Permission guard (for mill-staff)
export const requirePermission = (...permissions) => (req, res, next) => {
  // super-admin and mill-admin have all permissions
  if (['super-admin', 'mill-admin'].includes(req.user.role)) {
    return next();
  }
  
  // Check if mill-staff has required permission
  const hasPermission = permissions.some(p => 
    req.user.permissions?.includes(p)
  );
  
  if (!hasPermission) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};
```

---

## 7. Google OAuth Flow

### 7.1 Flow Diagram

```
1. User clicks "Sign in with Google" on client
2. Client redirects to: GET /api/auth/google
3. Server redirects to Google consent screen
4. User authenticates with Google
5. Google redirects to: GET /api/auth/google/callback?code=xxx
6. Server exchanges code for tokens
7. Server creates/updates user in DB
8. Server sets HTTP-only cookies (access + refresh tokens)
9. Server redirects to: {CLIENT_URL}/auth/google-success
10. Client fetches /api/auth/me and populates React Query cache
```

### 7.2 Environment Variables for Google OAuth

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/v1/auth/google/callback
```

---

## 8. Super Admin Seeding

### 8.1 Script: `src/scripts/seed-admin.js`

```javascript
// Runs before build (npm run prebuild)
// Creates multiple super-admins if not exist

const seedSuperAdmins = async () => {
  const admins = [
    {
      name: process.env.SUPER_ADMIN_1_NAME,
      email: process.env.SUPER_ADMIN_1_EMAIL,
      password: process.env.SUPER_ADMIN_1_PASSWORD,
      phone: process.env.SUPER_ADMIN_1_PHONE,
    },
    {
      name: process.env.SUPER_ADMIN_2_NAME,
      email: process.env.SUPER_ADMIN_2_EMAIL,
      password: process.env.SUPER_ADMIN_2_PASSWORD,
      phone: process.env.SUPER_ADMIN_2_PHONE,
    },
  ];
  
  for (const admin of admins) {
    if (!admin.email || !admin.password) continue;
    
    const existingAdmin = await User.findOne({ email: admin.email });
    
    if (existingAdmin) {
      console.log(`Super admin ${admin.email} already exists`);
      continue;
    }
    
    const hashedPassword = await bcrypt.hash(admin.password, 12);
    
    await User.create({
      email: admin.email,
      password: hashedPassword,
      name: admin.name || 'Super Admin',
      phone: admin.phone,
      role: 'super-admin',
      isActive: true,
    });
    
    console.log(`Super admin ${admin.email} created successfully`);
  }
};
```

### 8.2 Required Environment Variables

```env
SUPER_ADMIN_1_NAME=Super Admin1
SUPER_ADMIN_1_EMAIL=admin@example.com
SUPER_ADMIN_1_PASSWORD=securepassword123
SUPER_ADMIN_1_PHONE=1234567890
SUPER_ADMIN_2_NAME=Super Admin2
SUPER_ADMIN_2_EMAIL=developer@example.com
SUPER_ADMIN_2_PASSWORD=securepassword123
SUPER_ADMIN_2_PHONE=0987654321
```

---

## 9. Security Measures

### 9.1 Middleware Stack

```javascript
app.use(helmet());                          // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,                        // Allow cookies
}));
app.use(cookieParser());                    // Parse cookies
app.use(express.json({ limit: '10kb' }));   // Body parser with limit
app.use(mongoSanitize());                   // Prevent NoSQL injection
app.use(rateLimit({                         // Rate limiting
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
```

### 9.2 Cookie Security

```javascript
const cookieOptions = {
  httpOnly: true,                           // Not accessible via JS
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',                       // CSRF protection
  path: '/',
  maxAge: 15 * 60 * 1000,                  // 15 minutes for access token
};

const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 days for refresh token
  path: '/api/auth/refresh',               // Only sent to refresh endpoint
};
```

---

## 10. Logging Configuration

### 10.1 Logger Setup (`src/utils/logger.js`)

Using Winston with a single log file in the `logs` directory:

```javascript
import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logDir = process.env.LOG_DIR || 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console transport (for development)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // Single file transport
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: 10 * 1024 * 1024,  // 10MB max file size
      maxFiles: 5,                 // Keep 5 backup files
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
    }),
  ],
});

// Don't log to console in production
if (process.env.NODE_ENV === 'production') {
  logger.transports[0].silent = true;
}

export default logger;
```

### 10.2 Logger Usage Examples

```javascript
import logger from '../utils/logger.js';

// Info level
logger.info('Server started on port 5000');

// With metadata
logger.info('User logged in', { userId: '123', email: 'user@example.com' });

// Warning
logger.warn('Rate limit approaching', { ip: '192.168.1.1', count: 90 });

// Error with stack trace
logger.error('Database connection failed', error);

// Debug (only shown when LOG_LEVEL=debug)
logger.debug('Request payload', { body: req.body });
```

### 10.3 Log File Location

```
server/
└── logs/
    └── app.log              # Single log file (all levels)
```

---

## 11. API Response Format

### 11.1 Success Response

```javascript
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### 11.2 Error Response

```javascript
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }  // Optional validation errors
}
```

---

## 12. Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/mill-project
MONGODB_DATABASE_NAME=mill-project
MONGODB_TEST_DATABASE_NAME=mill-project-test

# JWT Secrets (IMPORTANT: Use different secrets for access and refresh tokens)
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/v1/auth/google/callback

# Logging
LOG_LEVEL=debug
LOG_DIR=logs

# Super Admin Seed (supports multiple admins)
SUPER_ADMIN_1_NAME=Super Admin1
SUPER_ADMIN_1_EMAIL=admin@example.com
SUPER_ADMIN_1_PASSWORD=securepassword123
SUPER_ADMIN_1_PHONE=1234567890
SUPER_ADMIN_2_NAME=Super Admin2
SUPER_ADMIN_2_EMAIL=developer@example.com
SUPER_ADMIN_2_PASSWORD=securepassword123
SUPER_ADMIN_2_PHONE=0987654321
```

---

## 13. Implementation Order

### Phase 1: Core Setup
1. [ ] Project structure and config files
2. [ ] Database connection (MongoDB)
3. [ ] Environment configuration
4. [ ] Logger setup (Winston)
5. [ ] Error handling middleware

### Phase 2: Models
6. [ ] User model
7. [ ] Mill model
8. [ ] RefreshToken model

### Phase 3: Authentication (REST API)
9. [ ] Token service (JWT generation/verification)
10. [ ] Passport local strategy
11. [ ] Passport JWT strategy (cookie extractor)
12. [ ] Auth controller (login, register, logout, refresh)
13. [ ] Auth routes

### Phase 4: Google OAuth
14. [ ] Passport Google OAuth strategy
15. [ ] Google auth controller
16. [ ] Google auth routes

### Phase 5: Socket.IO Setup
17. [ ] Socket.IO initialization and authentication
18. [ ] Socket middleware for role/permission guards
19. [ ] Admin socket handlers
20. [ ] Mill admin socket handlers
21. [ ] Mill staff socket handlers

### Phase 6: RBAC & Permissions
22. [ ] Role guard middleware
23. [ ] Permission guard middleware
24. [ ] Permission constants

### Phase 7: Admin Features
25. [ ] Super admin socket events (mills, mill-admins)
26. [ ] Mill admin socket events (staff, permissions)
27. [ ] Super admin seeder script

### Phase 8: Testing & Docs
28. [ ] Integration tests for auth (REST)
29. [ ] Integration tests for Socket.IO events
30. [ ] Integration tests for RBAC
31. [ ] API documentation (README)

---

## 14. Client Integration Points

### 14.1 Client State Management

**React Query** - Server state (data from API/Socket.IO)
- User authentication state
- All mill, staff, and operational data
- Automatic cache management
- Optimistic updates
- Background refetching

**Zustand** - UI state only
- Theme preferences
- Sidebar open/closed
- Modal states
- Form states
- Navigation state

**Hydration Strategy:**

Since HTTP-only cookies are used, no need to persist user in localStorage. On every page refresh:

1. React Query automatically calls `GET /api/auth/me`
2. Server validates the `access_token` cookie
3. If valid, server returns user data
4. React Query populates the cache
5. UI "wakes up" with authenticated state
6. If cookie expired, token refresh happens automatically
7. If refresh fails, user is redirected to login

```javascript
// Example: React Query user hook
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchMe = async () => {
  const { data } = await axios.get('/api/auth/me', {
    withCredentials: true,
  });
  return data.data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### 14.2 REST API (Authentication)

The client already expects these patterns:

| Client Expectation | Server Implementation |
|--------------------|----------------------|
| `withCredentials: true` | CORS with `credentials: true` |
| Cookie-based tokens | `HttpOnly` cookies for access/refresh |
| `POST /auth/login` | Returns `{ data: { user } }`, sets cookies |
| `POST /auth/register` | Returns `{ data: { user } }`, sets cookies |
| `POST /auth/google/login` | Token verification flow |
| `GET /auth/google` + callback | OAuth redirect flow |
| `POST /auth/refresh` | Reads refresh cookie, sets new cookies |
| `POST /auth/logout` | Clears cookies |
| `GET /auth/me` | Returns `{ data: User }` |
| `PUT /auth/profile` | Returns `{ data: User }` |
| Redirect to `/auth/google-success` | After Google OAuth success |

### 14.3 Socket.IO (Data Operations)

```javascript
// Client Socket.IO connection
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,  // Send cookies with connection
});

// Listen for connection
socket.on('connect', () => {
  console.log('Connected to server');
});

// Emit event and handle response
socket.emit('admin:mills:list', { page: 1, limit: 10 });
socket.on('admin:mills:list:response', (response) => {
  if (response.success) {
    console.log('Mills:', response.data);
  } else {
    console.error('Error:', response.error);
  }
});

// Handle authentication error
socket.on('connect_error', (error) => {
  if (error.message === 'Authentication required') {
    // Redirect to login
  }
});
```

**React Query + Socket.IO Integration:**

```javascript
// Example: Using Socket.IO with React Query mutations
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/hooks/useSocket';

export const useCreateMill = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (millData) => {
      return new Promise((resolve, reject) => {
        socket.emit('admin:mills:create', millData);
        socket.once('admin:mills:create:response', (response) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error));
          }
        });
      });
    },
    onSuccess: () => {
      // Invalidate and refetch mills list
      queryClient.invalidateQueries({ queryKey: ['mills'] });
    },
  });
};
```

---

## 15. File Dependencies (Existing)

### Server package.json (already configured)

```json
{
  "type": "module",
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^8.2.1",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.1.5",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "socket.io": "^4.8.3",
    "winston": "^3.19.0",
    "zod": "^4.3.6"
  }
}
```

---

## Summary

This implementation plan covers:

✅ Express.js with ES modules (JavaScript)  
✅ MongoDB with Mongoose  
✅ Passport.js authentication (local + Google OAuth)  
✅ JWT tokens stored ONLY in secure HttpOnly cookies  
✅ **REST API for authentication only**  
✅ **Socket.IO for all data operations** (admin, mill, staff)  
✅ Winston logging to single file in logs directory  
✅ Super admin seeding before build  
✅ Role hierarchy: super-admin → mill-admin → mill-staff  
✅ Granular permission system for mill-staff (controlled by mill-admin)  
✅ Full compatibility with existing client code  
