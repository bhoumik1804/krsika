import { User, Mill } from '../models/index.js';
import logger from '../utils/logger.js';
import { registerUser } from '../services/authService.js';

const sendResponse = (socket, event, success, data = null, error = null, code = null) => {
  socket.emit(event, {
    success,
    ...(data && { data }),
    ...(error && { error }),
    ...(code && { code }),
  });
};

export const millHandlers = (io, socket) => {
  const user = socket.user;
  const millId = user.millId;
  
  // Dashboard
  socket.on('mill:dashboard', async () => {
    try {
      const mill = await Mill.findById(millId).populate('ownerId', 'name email');
      
      if (!mill) {
        return sendResponse(socket, 'mill:dashboard:response', false, null, 'Mill not found', 'MILL_NOT_FOUND');
      }
      
      // Get mill statistics
      const staffCount = await User.countDocuments({ millId, role: 'mill-staff', isActive: true });
      
      const dashboardData = {
        mill,
        stats: {
          staffCount,
          // Add more stats as needed (purchases, sales, inventory, etc.)
        },
      };
      
      sendResponse(socket, 'mill:dashboard:response', true, dashboardData);
      logger.info('Mill admin accessed dashboard', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to get mill dashboard:', error);
      sendResponse(socket, 'mill:dashboard:response', false, null, error.message, 'GET_DASHBOARD_ERROR');
    }
  });
  
  // Staff Management
  socket.on('mill:staff:list', async (payload) => {
    try {
      const { page = 1, limit = 10, search, isActive } = payload || {};
      
      const query = { millId, role: 'mill-staff' };
      if (typeof isActive === 'boolean') query.isActive = isActive;
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
        ];
      }
      
      const staff = await User.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
      
      const total = await User.countDocuments(query);
      
      sendResponse(socket, 'mill:staff:list:response', true, {
        staff,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
      
      logger.info('Mill admin listed staff', { userId: user._id, millId, count: staff.length });
    } catch (error) {
      logger.error('Failed to list staff:', error);
      sendResponse(socket, 'mill:staff:list:response', false, null, error.message, 'LIST_STAFF_ERROR');
    }
  });
  
  socket.on('mill:staff:create', async (payload) => {
    try {
      const staff = await registerUser(
        {
          ...payload,
          role: 'mill-staff',
          millId,
        },
        user._id
      );
      
      sendResponse(socket, 'mill:staff:create:response', true, staff);
      logger.info('Mill admin created staff', { userId: user._id, millId, staffId: staff._id });
      
      // Broadcast to all mill-admins in this mill
      io.to(`mill-admin:${millId}`).emit('mill:staff:updated', { action: 'created', staff });
    } catch (error) {
      logger.error('Failed to create staff:', error);
      sendResponse(socket, 'mill:staff:create:response', false, null, error.message, 'CREATE_STAFF_ERROR');
    }
  });
  
  socket.on('mill:staff:get', async (payload) => {
    try {
      const { staffId } = payload;
      
      const staff = await User.findOne({ _id: staffId, millId, role: 'mill-staff' });
      
      if (!staff) {
        return sendResponse(socket, 'mill:staff:get:response', false, null, 'Staff not found', 'STAFF_NOT_FOUND');
      }
      
      sendResponse(socket, 'mill:staff:get:response', true, staff);
    } catch (error) {
      logger.error('Failed to get staff:', error);
      sendResponse(socket, 'mill:staff:get:response', false, null, error.message, 'GET_STAFF_ERROR');
    }
  });
  
  socket.on('mill:staff:update', async (payload) => {
    try {
      const { staffId, ...updates } = payload;
      
      // Only allow updating certain fields
      const allowedUpdates = ['name', 'phone', 'isActive'];
      const filteredUpdates = {};
      
      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });
      
      const staff = await User.findOneAndUpdate(
        { _id: staffId, millId, role: 'mill-staff' },
        filteredUpdates,
        { new: true, runValidators: true }
      );
      
      if (!staff) {
        return sendResponse(socket, 'mill:staff:update:response', false, null, 'Staff not found', 'STAFF_NOT_FOUND');
      }
      
      sendResponse(socket, 'mill:staff:update:response', true, staff);
      logger.info('Mill admin updated staff', { userId: user._id, millId, staffId });
      
      // Broadcast to all mill-admins in this mill
      io.to(`mill-admin:${millId}`).emit('mill:staff:updated', { action: 'updated', staff });
    } catch (error) {
      logger.error('Failed to update staff:', error);
      sendResponse(socket, 'mill:staff:update:response', false, null, error.message, 'UPDATE_STAFF_ERROR');
    }
  });
  
  socket.on('mill:staff:delete', async (payload) => {
    try {
      const { staffId } = payload;
      
      const staff = await User.findOneAndUpdate(
        { _id: staffId, millId, role: 'mill-staff' },
        { isActive: false },
        { new: true }
      );
      
      if (!staff) {
        return sendResponse(socket, 'mill:staff:delete:response', false, null, 'Staff not found', 'STAFF_NOT_FOUND');
      }
      
      sendResponse(socket, 'mill:staff:delete:response', true, staff);
      logger.info('Mill admin deactivated staff', { userId: user._id, millId, staffId });
      
      // Broadcast to all mill-admins in this mill
      io.to(`mill-admin:${millId}`).emit('mill:staff:updated', { action: 'deleted', staff });
    } catch (error) {
      logger.error('Failed to delete staff:', error);
      sendResponse(socket, 'mill:staff:delete:response', false, null, error.message, 'DELETE_STAFF_ERROR');
    }
  });
  
  // Permissions Management
  socket.on('mill:staff:permissions:update', async (payload) => {
    try {
      const { staffId, permissions } = payload;
      
      const staff = await User.findOneAndUpdate(
        { _id: staffId, millId, role: 'mill-staff' },
        { permissions },
        { new: true, runValidators: true }
      );
      
      if (!staff) {
        return sendResponse(socket, 'mill:staff:permissions:update:response', false, null, 'Staff not found', 'STAFF_NOT_FOUND');
      }
      
      sendResponse(socket, 'mill:staff:permissions:update:response', true, staff);
      logger.info('Mill admin updated staff permissions', { userId: user._id, millId, staffId, permissions });
      
      // Notify the staff member about permission change
      io.to(`mill-staff:${millId}`).emit('mill:staff:permissions:changed', { staffId, permissions });
    } catch (error) {
      logger.error('Failed to update staff permissions:', error);
      sendResponse(socket, 'mill:staff:permissions:update:response', false, null, error.message, 'UPDATE_PERMISSIONS_ERROR');
    }
  });
  
  socket.on('mill:staff:permissions:get', async (payload) => {
    try {
      const { staffId } = payload;
      
      const staff = await User.findOne(
        { _id: staffId, millId, role: 'mill-staff' },
        'permissions'
      );
      
      if (!staff) {
        return sendResponse(socket, 'mill:staff:permissions:get:response', false, null, 'Staff not found', 'STAFF_NOT_FOUND');
      }
      
      sendResponse(socket, 'mill:staff:permissions:get:response', true, { permissions: staff.permissions });
    } catch (error) {
      logger.error('Failed to get staff permissions:', error);
      sendResponse(socket, 'mill:staff:permissions:get:response', false, null, error.message, 'GET_PERMISSIONS_ERROR');
    }
  });
};
