import { User } from '../models/index.js';
import logger from '../utils/logger.js';

const sendResponse = (socket, event, success, data = null, error = null, code = null) => {
  socket.emit(event, {
    success,
    ...(data && { data }),
    ...(error && { error }),
    ...(code && { code }),
  });
};

const checkPermission = (user, requiredPermission) => {
  if (!user.permissions || !user.permissions.includes(requiredPermission)) {
    return false;
  }
  return true;
};

export const staffHandlers = (io, socket) => {
  const user = socket.user;
  const millId = user.millId;
  
  // Dashboard
  socket.on('staff:dashboard', async () => {
    try {
      const dashboardData = {
        user: {
          name: user.name,
          email: user.email,
          permissions: user.permissions,
        },
        mill: user.millId,
        stats: {
          // Add relevant stats based on permissions
        },
      };
      
      sendResponse(socket, 'staff:dashboard:response', true, dashboardData);
      logger.info('Staff accessed dashboard', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to get staff dashboard:', error);
      sendResponse(socket, 'staff:dashboard:response', false, null, error.message, 'GET_DASHBOARD_ERROR');
    }
  });
  
  // Get own permissions
  socket.on('staff:permissions', async () => {
    try {
      sendResponse(socket, 'staff:permissions:response', true, { permissions: user.permissions });
    } catch (error) {
      logger.error('Failed to get permissions:', error);
      sendResponse(socket, 'staff:permissions:response', false, null, error.message, 'GET_PERMISSIONS_ERROR');
    }
  });
  
  // Purchases handlers
  socket.on('staff:purchases:list', async (payload) => {
    if (!checkPermission(user, 'purchases.read')) {
      return sendResponse(socket, 'staff:purchases:list:response', false, null, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }
    
    try {
      // Placeholder - implement actual purchase listing logic
      // This would query Purchase model filtered by millId
      
      const purchases = []; // Replace with actual query
      
      sendResponse(socket, 'staff:purchases:list:response', true, purchases);
      logger.info('Staff listed purchases', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to list purchases:', error);
      sendResponse(socket, 'staff:purchases:list:response', false, null, error.message, 'LIST_PURCHASES_ERROR');
    }
  });
  
  socket.on('staff:purchases:create', async (payload) => {
    if (!checkPermission(user, 'purchases.create')) {
      return sendResponse(socket, 'staff:purchases:create:response', false, null, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }
    
    try {
      // Placeholder - implement actual purchase creation logic
      // Ensure millId is automatically set to user.millId
      
      const purchase = { ...payload, millId, createdBy: user._id };
      
      sendResponse(socket, 'staff:purchases:create:response', true, purchase);
      logger.info('Staff created purchase', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to create purchase:', error);
      sendResponse(socket, 'staff:purchases:create:response', false, null, error.message, 'CREATE_PURCHASE_ERROR');
    }
  });
  
  // Sales handlers
  socket.on('staff:sales:list', async (payload) => {
    if (!checkPermission(user, 'sales.read')) {
      return sendResponse(socket, 'staff:sales:list:response', false, null, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }
    
    try {
      // Placeholder - implement actual sales listing logic
      const sales = [];
      
      sendResponse(socket, 'staff:sales:list:response', true, sales);
      logger.info('Staff listed sales', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to list sales:', error);
      sendResponse(socket, 'staff:sales:list:response', false, null, error.message, 'LIST_SALES_ERROR');
    }
  });
  
  socket.on('staff:sales:create', async (payload) => {
    if (!checkPermission(user, 'sales.create')) {
      return sendResponse(socket, 'staff:sales:create:response', false, null, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }
    
    try {
      // Placeholder - implement actual sales creation logic
      const sale = { ...payload, millId, createdBy: user._id };
      
      sendResponse(socket, 'staff:sales:create:response', true, sale);
      logger.info('Staff created sale', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to create sale:', error);
      sendResponse(socket, 'staff:sales:create:response', false, null, error.message, 'CREATE_SALE_ERROR');
    }
  });
  
  // Inventory handlers
  socket.on('staff:inventory:get', async (payload) => {
    if (!checkPermission(user, 'inventory.read')) {
      return sendResponse(socket, 'staff:inventory:get:response', false, null, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }
    
    try {
      // Placeholder - implement actual inventory retrieval logic
      const inventory = {};
      
      sendResponse(socket, 'staff:inventory:get:response', true, inventory);
      logger.info('Staff viewed inventory', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to get inventory:', error);
      sendResponse(socket, 'staff:inventory:get:response', false, null, error.message, 'GET_INVENTORY_ERROR');
    }
  });
  
  // Input Data handlers
  socket.on('staff:inputdata:parties:list', async (payload) => {
    if (!checkPermission(user, 'inputdata.parties')) {
      return sendResponse(socket, 'staff:inputdata:parties:list:response', false, null, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }
    
    try {
      // Placeholder - implement actual parties listing logic
      const parties = [];
      
      sendResponse(socket, 'staff:inputdata:parties:list:response', true, parties);
      logger.info('Staff listed parties', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to list parties:', error);
      sendResponse(socket, 'staff:inputdata:parties:list:response', false, null, error.message, 'LIST_PARTIES_ERROR');
    }
  });
  
  // Reports handlers
  socket.on('staff:reports:daily', async (payload) => {
    if (!checkPermission(user, 'reports.daily')) {
      return sendResponse(socket, 'staff:reports:daily:response', false, null, 'Insufficient permissions', 'INSUFFICIENT_PERMISSIONS');
    }
    
    try {
      // Placeholder - implement actual daily report logic
      const report = {};
      
      sendResponse(socket, 'staff:reports:daily:response', true, report);
      logger.info('Staff viewed daily report', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to get daily report:', error);
      sendResponse(socket, 'staff:reports:daily:response', false, null, error.message, 'GET_DAILY_REPORT_ERROR');
    }
  });
  
  // Note: Additional handlers for other operations (inward, outward, milling, financial, etc.)
  // should be implemented following the same pattern:
  // 1. Check permission
  // 2. Ensure millId is always set to user.millId
  // 3. Implement business logic
  // 4. Send response
  // 5. Log action
};
