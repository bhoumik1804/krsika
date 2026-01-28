import config from './index.js'

/**
 * Socket.io configuration
 */
export const socketConfig = {
    cors: {
        origin: config.socket.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
    },

    // Connection settings
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 10000,
    maxHttpBufferSize: 1e6, // 1MB

    // Transports
    transports: ['websocket', 'polling'],

    // Allow upgrades
    allowUpgrades: true,

    // Cookie settings
    cookie: {
        name: 'ricemill.io',
        httpOnly: true,
        sameSite: 'strict',
        secure: config.server.isProduction,
    },

    // Connection state recovery
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        skipMiddlewares: true,
    },

    // Adapter options (for Redis in production)
    adapter: {
        // Will be configured when Redis is added
        // For now, using default in-memory adapter
    },

    // Namespaces
    namespaces: {
        main: '/',
        notifications: '/notifications',
        chat: '/chat',
        updates: '/updates',
    },

    // Room names
    rooms: {
        // Mill-specific rooms
        millRoom: (millId) => `mill:${millId}`,

        // User-specific rooms
        userRoom: (userId) => `user:${userId}`,

        // Role-specific rooms
        roleRoom: (role) => `role:${role}`,

        // Global rooms
        broadcast: 'broadcast',
        alerts: 'alerts',
    },

    // Event names
    events: {
        // Connection events
        connection: 'connection',
        disconnect: 'disconnect',
        error: 'error',

        // Authentication events
        authenticate: 'authenticate',
        authenticated: 'authenticated',
        authError: 'auth:error',

        // Notification events
        notification: 'notification',
        notificationRead: 'notification:read',
        notificationDelete: 'notification:delete',

        // Stock events
        stockUpdate: 'stock:update',
        stockAlert: 'stock:alert',
        lowStockAlert: 'stock:low',

        // Purchase events
        purchaseCreated: 'purchase:created',
        purchaseUpdated: 'purchase:updated',
        purchaseDeleted: 'purchase:deleted',

        // Sale events
        saleCreated: 'sale:created',
        saleUpdated: 'sale:updated',
        saleDeleted: 'sale:deleted',

        // Payment events
        paymentReceived: 'payment:received',
        paymentPending: 'payment:pending',

        // System events
        systemAlert: 'system:alert',
        systemMaintenance: 'system:maintenance',
    },
}

export default socketConfig
