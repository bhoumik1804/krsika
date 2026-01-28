# Part 6: Error Handling & Logging

> Rice Mill SaaS Platform - Error Management & Application Logging

---

## 1. Error Handling Strategy

### Error Hierarchy

```
ApiError (Base Class)
├── BadRequestError (400)
├── UnauthorizedError (401)
├── ForbiddenError (403)
├── NotFoundError (404)
├── ConflictError (409)
├── ValidationError (422)
└── InternalServerError (500)
```

---

## 2. Custom Error Classes

```javascript
// src/shared/utils/api-error.js

/**
 * Base API Error Class
 */
class ApiError extends Error {
  constructor(statusCode, message, code = null, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
class BadRequestError extends ApiError {
  constructor(message = 'Bad request', errors = null) {
    super(400, message, 'BAD_REQUEST', errors);
  }
}

/**
 * 401 Unauthorized
 */
class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access') {
    super(401, message, 'UNAUTHORIZED');
  }
}

/**
 * 403 Forbidden
 */
class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

/**
 * 404 Not Found
 */
class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
  }
}

/**
 * 409 Conflict
 */
class ConflictError extends ApiError {
  constructor(message = 'Resource conflict') {
    super(409, message, 'CONFLICT');
  }
}

/**
 * 422 Validation Error
 */
class ValidationError extends ApiError {
  constructor(errors) {
    super(422, 'Validation failed', 'VALIDATION_ERROR', errors);
  }
}

/**
 * 500 Internal Server Error
 */
class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
};
```

---

## 3. Global Error Handler

```javascript
// src/shared/middlewares/error-handler.js
const { ApiError } = require('../utils/api-error');
const logger = require('../utils/logger');
const config = require('../../config');

/**
 * Global Express error handler
 */
function errorHandler(err, req, res, next) {
  let error = err;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`, 'CAST_ERROR');
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error = new ApiError(409, `${field} '${value}' already exists`, 'DUPLICATE_ENTRY');
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
      kind: e.kind,
    }));
    error = new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', errors);
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token', 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired', 'TOKEN_EXPIRED');
  }

  // Handle Multer File Upload Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new ApiError(400, 'File too large', 'FILE_TOO_LARGE');
    } else {
      error = new ApiError(400, 'File upload error', 'FILE_UPLOAD_ERROR');
    }
  }

  // Log error
  const logData = {
    message: error.message,
    statusCode: error.statusCode,
    code: error.code,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?._id,
    userAgent: req.get('user-agent'),
    ...(error.statusCode >= 500 && { stack: error.stack }),
  };

  if (error.statusCode >= 500) {
    logger.error('Server error:', logData);
  } else {
    logger.warn('Client error:', logData);
  }

  // Determine if it's an operational error
  const isOperational = error instanceof ApiError && error.isOperational;

  // Send response
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      errors: error.errors,
      ...(config.isDevelopment && { stack: error.stack }),
    });
  }

  // Unknown/Programming errors
  if (!isOperational) {
    logger.error('CRITICAL: Unhandled error', {
      error: error.message,
      stack: error.stack,
    });
  }

  return res.status(500).json({
    success: false,
    message: config.isDevelopment ? error.message : 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    ...(config.isDevelopment && { stack: error.stack }),
  });
}

/**
 * 404 Not Found Handler
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    code: 'NOT_FOUND',
  });
}

module.exports = { errorHandler, notFoundHandler };
```

---

## 4. Async Handler Utility

```javascript
// src/shared/utils/async-handler.js

/**
 * Wrapper for async route handlers to catch errors
 * Eliminates need for try-catch in every controller
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;

// Usage example:
// const getUsers = asyncHandler(async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });
```

---

## 5. Winston Logger Setup

```javascript
// src/shared/utils/logger.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const config = require('../../config');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format (for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Create transports
const transports = [
  // Console transport (always enabled)
  new winston.transports.Console({
    format: consoleFormat,
    level: config.isDevelopment ? 'debug' : 'info',
  }),
];

// File transports (production only)
if (!config.isDevelopment) {
  // All logs
  transports.push(
    new DailyRotateFile({
      filename: path.join('logs', 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat,
      level: 'info',
    })
  );

  // Error logs
  transports.push(
    new DailyRotateFile({
      filename: path.join('logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: logFormat,
      level: 'error',
    })
  );

  // Combined logs
  transports.push(
    new DailyRotateFile({
      filename: path.join('logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '7d',
      format: logFormat,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: config.logLevel || 'info',
  format: logFormat,
  transports,
  exitOnError: false,
});

// Stream for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
```

---

## 6. Request Logging Middleware

```javascript
// src/shared/middlewares/request-logger.js
const morgan = require('morgan');
const logger = require('../utils/logger');
const config = require('../../config');

// Custom Morgan token for response time in milliseconds
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

// Custom Morgan token for user ID
morgan.token('user-id', (req) => {
  return req.user?._id || 'anonymous';
});

// Define log format
const morganFormat = config.isDevelopment
  ? ':method :url :status :response-time ms - :user-id'
  : ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Create middleware
const requestLogger = morgan(morganFormat, {
  stream: logger.stream,
  skip: (req) => {
    // Skip health check and favicon requests
    return req.url === '/api/v1/health' || req.url === '/favicon.ico';
  },
});

module.exports = { requestLogger };
```

---

## 7. Response Time Middleware

```javascript
// src/shared/middlewares/response-time.js
const responseTime = require('response-time');

const responseTimeMiddleware = responseTime((req, res, time) => {
  // Round to 2 decimal places
  const rounded = Math.round(time * 100) / 100;

  // Set header
  res.setHeader('X-Response-Time', rounded);

  // Log slow requests (> 1 second)
  if (time > 1000) {
    const logger = require('../utils/logger');
    logger.warn('Slow request detected', {
      method: req.method,
      url: req.url,
      duration: `${rounded}ms`,
      userId: req.user?._id,
    });
  }
});

module.exports = { responseTimeMiddleware };
```

---

## 8. Audit Logging

### Audit Log Model

```javascript
// src/shared/models/audit-log.model.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT'],
    },
    entity: {
      type: String,
      required: true, // 'Purchase', 'Sale', 'User', etc.
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed, // Old and new values
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // Using custom timestamp field
  }
);

// Index for querying
auditLogSchema.index({ millId: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });

// TTL index - auto-delete logs older than 90 days
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
```

### Audit Service

```javascript
// src/shared/services/audit.service.js
const AuditLog = require('../models/audit-log.model');
const logger = require('../utils/logger');

class AuditService {
  async log(data) {
    try {
      await AuditLog.create({
        millId: data.millId,
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        changes: data.changes,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to create audit log:', error);
    }
  }

  async logCreate(entity, entityId, userId, millId, req) {
    await this.log({
      millId,
      userId,
      action: 'CREATE',
      entity,
      entityId,
      ipAddress: req?.ip,
      userAgent: req?.get('user-agent'),
    });
  }

  async logUpdate(entity, entityId, userId, millId, changes, req) {
    await this.log({
      millId,
      userId,
      action: 'UPDATE',
      entity,
      entityId,
      changes,
      ipAddress: req?.ip,
      userAgent: req?.get('user-agent'),
    });
  }

  async logDelete(entity, entityId, userId, millId, req) {
    await this.log({
      millId,
      userId,
      action: 'DELETE',
      entity,
      entityId,
      ipAddress: req?.ip,
      userAgent: req?.get('user-agent'),
    });
  }

  async getAuditLogs(filters, options = {}) {
    const { page = 1, limit = 50 } = options;
    const query = {};

    if (filters.millId) query.millId = filters.millId;
    if (filters.userId) query.userId = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.entity) query.entity = filters.entity;
    if (filters.startDate) query.timestamp = { $gte: new Date(filters.startDate) };
    if (filters.endDate) query.timestamp = { ...query.timestamp, $lte: new Date(filters.endDate) };

    const [data, total] = await Promise.all([
      AuditLog.find(query)
        .populate('userId', 'name email')
        .populate('millId', 'name code')
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new AuditService();
```

---

## 9. Error Monitoring (Production)

### Sentry Integration (Optional)

```javascript
// src/shared/utils/sentry.js
const Sentry = require('@sentry/node');
const config = require('../../config');

function initSentry(app) {
  if (config.sentry.dsn) {
    Sentry.init({
      dsn: config.sentry.dsn,
      environment: config.nodeEnv,
      tracesSampleRate: 1.0,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
      ],
    });

    // Request handler must be the first middleware
    app.use(Sentry.Handlers.requestHandler());

    // Tracing handler
    app.use(Sentry.Handlers.tracingHandler());
  }
}

function errorHandler() {
  return Sentry.Handlers.errorHandler();
}

module.exports = { initSentry, sentryErrorHandler: errorHandler };
```

---

## 10. Application Integration

```javascript
// src/app.js
const express = require('express');
const { errorHandler, notFoundHandler } = require('./shared/middlewares/error-handler');
const { requestLogger } = require('./shared/middlewares/request-logger');
const { responseTimeMiddleware } = require('./shared/middlewares/response-time');
const logger = require('./shared/utils/logger');

const app = express();

// Request logging
app.use(responseTimeMiddleware);
app.use(requestLogger);

// ... other middlewares and routes ...

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in production, just log
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1); // Exit process on uncaught exceptions
});

module.exports = app;
```

---

## Next Steps

Continue to:
- [Part 7: Testing](./implementation-part-7-testing.md) - Unit and integration tests
- [Part 8: Deployment](./implementation-part-8-deployment.md) - Docker and deployment
