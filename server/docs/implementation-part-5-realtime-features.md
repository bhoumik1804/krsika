# Part 5: Real-Time Features with Socket.io

> Rice Mill SaaS Platform - WebSocket Communication & Real-Time Updates

---

## 1. Socket.io Overview

### Why Socket.io?

- **Real-time updates**: Instant notifications for transactions, stock changes
- **Multi-device sync**: Keep multiple devices in sync
- **Live dashboard**: Real-time statistics updates
- **Activity feed**: See what's happening in the mill
- **Collaboration**: Multiple users working simultaneously

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Socket.io Server                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Namespaces:                                                 │
│  ├── / (default)                                            │
│  ├── /admin                                                  │
│  └── /mill                                                   │
│                                                              │
│  Rooms (per namespace):                                      │
│  ├── user:{userId}         (private user room)             │
│  ├── mill:{millId}         (mill-specific room)            │
│  └── admin                 (super admin room)              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Socket.io Initialization

### Server Setup

```javascript
// src/shared/socket/index.js
const { Server } = require('socket.io');
const tokenService = require('../../modules/auth/services/token.service');
const User = require('../models/user.model');
const logger = require('../utils/logger');

function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const payload = tokenService.verifyAccessToken(token);

      if (!payload) {
        return next(new Error('Invalid token'));
      }

      const user = await User.findById(payload.sub).select('_id role millId name').lean();

      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    const user = socket.data.user;
    logger.info(`Socket connected: ${user._id} (${user.name})`);

    // Auto-join rooms
    socket.join(`user:${user._id}`);

    if (user.role === 'SUPER_ADMIN') {
      socket.join('admin');
    }

    if (user.millId) {
      socket.join(`mill:${user.millId}`);
      logger.info(`User ${user.name} joined mill room: ${user.millId}`);
    }

    // Setup event handlers
    setupEventHandlers(socket, io);

    // Send connection confirmation
    socket.emit('connected', {
      userId: user._id,
      message: 'Connected successfully',
    });

    // Disconnect handler
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${user._id}, reason: ${reason}`);
    });
  });

  return io;
}

module.exports = { initializeSocket };
```

---

## 3. Event Handlers

### Setup Event Handlers

```javascript
// src/shared/socket/handlers/index.js
const logger = require('../../utils/logger');

function setupEventHandlers(socket, io) {
  const user = socket.data.user;

  // Join specific mill room (for super admin viewing different mills)
  socket.on('join:mill', (millId) => {
    if (user.role === 'SUPER_ADMIN' || user.millId?.toString() === millId) {
      socket.join(`mill:${millId}`);
      socket.emit('joined:mill', { millId });
      logger.info(`User ${user.name} joined mill: ${millId}`);
    } else {
      socket.emit('error', { message: 'Access denied to this mill' });
    }
  });

  // Leave mill room
  socket.on('leave:mill', (millId) => {
    socket.leave(`mill:${millId}`);
    socket.emit('left:mill', { millId });
  });

  // Request dashboard stats
  socket.on('request:dashboard', async (millId) => {
    try {
      const dashboardService = require('../../../modules/mill/services/dashboard.service');
      const stats = await dashboardService.getMillStats(millId);

      socket.emit('dashboard:stats', stats);
    } catch (error) {
      socket.emit('error', { message: 'Failed to fetch dashboard stats' });
    }
  });

  // Typing indicator (for collaborative editing)
  socket.on('activity:typing', (data) => {
    socket.to(`mill:${data.millId}`).emit('activity:typing', {
      user: { id: user._id, name: user.name },
      entity: data.entity, // 'purchase', 'sale', etc.
      action: data.action, // 'creating', 'editing'
    });
  });

  // Stop typing
  socket.on('activity:stop-typing', (data) => {
    socket.to(`mill:${data.millId}`).emit('activity:stop-typing', {
      user: { id: user._id, name: user.name },
    });
  });
}

module.exports = { setupEventHandlers };
```

---

## 4. Event Types & Constants

```javascript
// src/shared/socket/events.js

const SERVER_EVENTS = {
  // Connection
  CONNECTED: 'connected',
  ERROR: 'error',

  // Notifications
  NOTIFICATION: 'notification',

  // Purchase events
  PURCHASE_CREATED: 'purchase:created',
  PURCHASE_UPDATED: 'purchase:updated',
  PURCHASE_DELETED: 'purchase:deleted',

  // Sale events
  SALE_CREATED: 'sale:created',
  SALE_UPDATED: 'sale:updated',
  SALE_DELETED: 'sale:deleted',

  // Inward/Outward events
  INWARD_CREATED: 'inward:created',
  OUTWARD_CREATED: 'outward:created',

  // Milling events
  MILLING_STARTED: 'milling:started',
  MILLING_COMPLETED: 'milling:completed',

  // Stock events
  STOCK_UPDATED: 'stock:updated',
  STOCK_LOW_ALERT: 'stock:low-alert',

  // Financial events
  PAYMENT_RECEIVED: 'payment:received',
  PAYMENT_MADE: 'payment:made',
  RECEIPT_CREATED: 'receipt:created',

  // Dashboard updates
  DASHBOARD_STATS: 'dashboard:stats',

  // Activity feed
  ACTIVITY_NEW: 'activity:new',
  ACTIVITY_TYPING: 'activity:typing',
  ACTIVITY_STOP_TYPING: 'activity:stop-typing',

  // Staff events
  ATTENDANCE_MARKED: 'attendance:marked',
  STAFF_JOINED: 'staff:joined',
  STAFF_LEFT: 'staff:left',
};

const CLIENT_EVENTS = {
  JOIN_MILL: 'join:mill',
  LEAVE_MILL: 'leave:mill',
  REQUEST_DASHBOARD: 'request:dashboard',
  ACTIVITY_TYPING: 'activity:typing',
  ACTIVITY_STOP_TYPING: 'activity:stop-typing',
};

module.exports = { SERVER_EVENTS, CLIENT_EVENTS };
```

---

## 5. Emitting Events from Controllers

### Example: Purchase Controller with Socket Emit

```javascript
// src/modules/purchase/controllers/paddy-purchase.controller.js
const PaddyPurchaseService = require('../services/paddy-purchase.service');
const asyncHandler = require('../../../shared/utils/async-handler');
const ApiResponse = require('../../../shared/utils/api-response');
const { SERVER_EVENTS } = require('../../../shared/socket/events');

class PaddyPurchaseController {
  create = asyncHandler(async (req, res) => {
    const { millId } = req.params;
    const purchase = await PaddyPurchaseService.create(millId, req.body, req.user._id);

    // Emit real-time event to all users in the mill room
    const io = req.app.get('io');
    io.to(`mill:${millId}`).emit(SERVER_EVENTS.PURCHASE_CREATED, {
      purchase,
      createdBy: {
        id: req.user._id,
        name: req.user.name,
      },
    });

    // Also emit notification
    io.to(`mill:${millId}`).emit(SERVER_EVENTS.NOTIFICATION, {
      type: 'success',
      title: 'New Purchase',
      message: `${req.user.name} created a new purchase`,
      data: { purchaseId: purchase._id },
    });

    res.status(201).json(ApiResponse.created(purchase));
  });

  update = asyncHandler(async (req, res) => {
    const { millId, id } = req.params;
    const purchase = await PaddyPurchaseService.update(millId, id, req.body);

    const io = req.app.get('io');
    io.to(`mill:${millId}`).emit(SERVER_EVENTS.PURCHASE_UPDATED, {
      purchase,
      updatedBy: {
        id: req.user._id,
        name: req.user.name,
      },
    });

    res.json(ApiResponse.success(purchase, 'Purchase updated successfully'));
  });

  delete = asyncHandler(async (req, res) => {
    const { millId, id } = req.params;
    await PaddyPurchaseService.delete(millId, id);

    const io = req.app.get('io');
    io.to(`mill:${millId}`).emit(SERVER_EVENTS.PURCHASE_DELETED, {
      purchaseId: id,
      deletedBy: {
        id: req.user._id,
        name: req.user.name,
      },
    });

    res.json(ApiResponse.success(null, 'Purchase deleted successfully'));
  });
}

module.exports = new PaddyPurchaseController();
```

---

## 6. Stock Alert Service with Socket

### Automatic Low Stock Alerts

```javascript
// src/modules/inventory/services/stock-alert.service.js
const Stock = require('../../../shared/models/stock.model');
const { SERVER_EVENTS } = require('../../../shared/socket/events');

class StockAlertService {
  constructor() {
    this.io = null;
  }

  setIO(io) {
    this.io = io;
  }

  async checkLowStock(millId) {
    const lowStocks = await Stock.find({
      millId,
      $expr: { $lte: ['$quantity', '$minStockLevel'] },
    }).lean();

    if (lowStocks.length > 0 && this.io) {
      lowStocks.forEach((stock) => {
        this.io.to(`mill:${millId}`).emit(SERVER_EVENTS.STOCK_LOW_ALERT, {
          stockType: stock.stockType,
          currentQuantity: stock.quantity,
          minLevel: stock.minStockLevel,
          severity: this.getSeverity(stock.quantity, stock.minStockLevel),
        });
      });
    }

    return lowStocks;
  }

  getSeverity(current, min) {
    const percentage = (current / min) * 100;
    if (percentage === 0) return 'critical';
    if (percentage <= 50) return 'high';
    return 'medium';
  }

  async monitorStockLevels(millId) {
    // Run periodically (e.g., every hour)
    setInterval(() => {
      this.checkLowStock(millId);
    }, 60 * 60 * 1000); // 1 hour
  }
}

module.exports = new StockAlertService();
```

---

## 7. Client Integration Example

### React Client Connection

```javascript
// client/src/services/socket.service.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connected', (data) => {
      console.log('Socket connected:', data);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Join mill room
  joinMill(millId) {
    this.socket?.emit('join:mill', millId);
  }

  // Leave mill room
  leaveMill(millId) {
    this.socket?.emit('leave:mill', millId);
  }

  // Listen to purchase events
  onPurchaseCreated(callback) {
    this.socket?.on('purchase:created', callback);
  }

  onPurchaseUpdated(callback) {
    this.socket?.on('purchase:updated', callback);
  }

  onPurchaseDeleted(callback) {
    this.socket?.on('purchase:deleted', callback);
  }

  // Listen to notifications
  onNotification(callback) {
    this.socket?.on('notification', callback);
  }

  // Request dashboard stats
  requestDashboard(millId) {
    this.socket?.emit('request:dashboard', millId);
  }

  onDashboardStats(callback) {
    this.socket?.on('dashboard:stats', callback);
  }

  // Clean up listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();
```

### React Hook for Socket

```javascript
// client/src/hooks/useSocket.js
import { useEffect } from 'react';
import socketService from '../services/socket.service';
import { useAuthStore } from '../stores/auth-store';

export function useSocket() {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      socketService.connect(accessToken);
    }

    return () => {
      socketService.disconnect();
    };
  }, [accessToken]);

  return socketService;
}
```

---

## 8. Notification Service

```javascript
// src/modules/notification/services/notification.service.js
const { SERVER_EVENTS } = require('../../../shared/socket/events');

class NotificationService {
  constructor() {
    this.io = null;
  }

  setIO(io) {
    this.io = io;
  }

  // Send notification to specific user
  sendToUser(userId, notification) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(SERVER_EVENTS.NOTIFICATION, notification);
    }
  }

  // Send notification to all users in a mill
  sendToMill(millId, notification) {
    if (this.io) {
      this.io.to(`mill:${millId}`).emit(SERVER_EVENTS.NOTIFICATION, notification);
    }
  }

  // Send notification to all super admins
  sendToAdmins(notification) {
    if (this.io) {
      this.io.to('admin').emit(SERVER_EVENTS.NOTIFICATION, notification);
    }
  }

  // Broadcast to everyone
  broadcast(notification) {
    if (this.io) {
      this.io.emit(SERVER_EVENTS.NOTIFICATION, notification);
    }
  }
}

module.exports = new NotificationService();
```

---

## 9. App Integration

### Express App Setup with Socket.io

```javascript
// src/app.js
const express = require('express');
const http = require('http');
const { initializeSocket } = require('./shared/socket');
const routes = require('./routes/v1');
const stockAlertService = require('./modules/inventory/services/stock-alert.service');
const notificationService = require('./modules/notification/services/notification.service');

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);
app.set('io', io);

// Set IO for services that need it
stockAlertService.setIO(io);
notificationService.setIO(io);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

module.exports = { app, httpServer };
```

### Server Entry Point

```javascript
// src/server.js
const { app, httpServer } = require('./app');
const connectDB = require('./shared/database/connection');
const config = require('./config');
const logger = require('./shared/utils/logger');

async function startServer() {
  try {
    // Connect to database
    await connectDB();

    // Start HTTP server (includes Socket.io)
    const PORT = config.port || 5000;
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 Socket.io server ready`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

---

## Next Steps

Continue to:
- [Part 6: Error Handling & Logging](./implementation-part-6-error-logging.md) - Error handling and Winston logger
- [Part 7: Testing](./implementation-part-7-testing.md) - Unit and integration tests
