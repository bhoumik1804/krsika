/**
 * Event types for internal event bus
 * Used for module-to-module communication
 */

export const EVENT_TYPES = {
    // User events
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    USER_LOGIN: 'user.login',
    USER_LOGOUT: 'user.logout',

    // Mill events
    MILL_CREATED: 'mill.created',
    MILL_UPDATED: 'mill.updated',
    MILL_DELETED: 'mill.deleted',
    MILL_ACTIVATED: 'mill.activated',
    MILL_DEACTIVATED: 'mill.deactivated',

    // Purchase events
    PURCHASE_CREATED: 'purchase.created',
    PURCHASE_UPDATED: 'purchase.updated',
    PURCHASE_DELETED: 'purchase.deleted',
    PURCHASE_VERIFIED: 'purchase.verified',

    // Sale events
    SALE_CREATED: 'sale.created',
    SALE_UPDATED: 'sale.updated',
    SALE_DELETED: 'sale.deleted',
    SALE_DELIVERED: 'sale.delivered',

    // Stock events
    STOCK_UPDATED: 'stock.updated',
    STOCK_LOW: 'stock.low',
    STOCK_ALERT: 'stock.alert',
    STOCK_TRANSFER: 'stock.transfer',

    // Payment events
    PAYMENT_RECEIVED: 'payment.received',
    PAYMENT_PENDING: 'payment.pending',
    PAYMENT_FAILED: 'payment.failed',
    PAYMENT_REFUNDED: 'payment.refunded',

    // Inward/Outward events
    INWARD_CREATED: 'inward.created',
    INWARD_UPDATED: 'inward.updated',
    OUTWARD_CREATED: 'outward.created',
    OUTWARD_UPDATED: 'outward.updated',

    // Milling events
    MILLING_STARTED: 'milling.started',
    MILLING_COMPLETED: 'milling.completed',
    MILLING_FAILED: 'milling.failed',

    // Subscription events
    SUBSCRIPTION_CREATED: 'subscription.created',
    SUBSCRIPTION_RENEWED: 'subscription.renewed',
    SUBSCRIPTION_EXPIRED: 'subscription.expired',
    SUBSCRIPTION_CANCELLED: 'subscription.cancelled',

    // Notification events
    NOTIFICATION_SENT: 'notification.sent',
    NOTIFICATION_READ: 'notification.read',
    NOTIFICATION_DELETED: 'notification.deleted',

    // Report events
    REPORT_GENERATED: 'report.generated',
    REPORT_FAILED: 'report.failed',

    // System events
    SYSTEM_ERROR: 'system.error',
    SYSTEM_WARNING: 'system.warning',
    SYSTEM_MAINTENANCE: 'system.maintenance',

    // Audit events
    AUDIT_LOG: 'audit.log',
    SECURITY_EVENT: 'security.event',
}

export default EVENT_TYPES
