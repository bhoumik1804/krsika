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

export const adminHandlers = (io, socket) => {
  const user = socket.user;
  
  // Mills Management
  socket.on('admin:mills:list', async (payload) => {
    try {
      const { page = 1, limit = 10, status, search } = payload || {};
      
      const query = {};
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { code: new RegExp(search, 'i') },
        ];
      }
      
      const mills = await Mill.find(query)
        .populate('ownerId', 'name email')
        .populate('createdBy', 'name email')
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
      
      const total = await Mill.countDocuments(query);
      
      sendResponse(socket, 'admin:mills:list:response', true, {
        mills,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
      
      logger.info('Super admin listed mills', { userId: user._id, count: mills.length });
    } catch (error) {
      logger.error('Failed to list mills:', error);
      sendResponse(socket, 'admin:mills:list:response', false, null, error.message, 'LIST_MILLS_ERROR');
    }
  });
  
  socket.on('admin:mills:create', async (payload) => {
    try {
      const mill = await Mill.create({
        ...payload,
        createdBy: user._id,
      });
      
      await mill.populate('ownerId', 'name email');
      
      sendResponse(socket, 'admin:mills:create:response', true, mill, null);
      logger.info('Super admin created mill', { userId: user._id, millId: mill._id });
      
      // Broadcast to all super-admins
      io.to('super-admin').emit('admin:mills:updated', { action: 'created', mill });
    } catch (error) {
      logger.error('Failed to create mill:', error);
      sendResponse(socket, 'admin:mills:create:response', false, null, error.message, 'CREATE_MILL_ERROR');
    }
  });
  
  socket.on('admin:mills:get', async (payload) => {
    try {
      const { millId } = payload;
      
      const mill = await Mill.findById(millId)
        .populate('ownerId', 'name email phone')
        .populate('createdBy', 'name email');
      
      if (!mill) {
        return sendResponse(socket, 'admin:mills:get:response', false, null, 'Mill not found', 'MILL_NOT_FOUND');
      }
      
      sendResponse(socket, 'admin:mills:get:response', true, mill);
    } catch (error) {
      logger.error('Failed to get mill:', error);
      sendResponse(socket, 'admin:mills:get:response', false, null, error.message, 'GET_MILL_ERROR');
    }
  });
  
  socket.on('admin:mills:update', async (payload) => {
    try {
      const { millId, ...updates } = payload;
      
      const mill = await Mill.findByIdAndUpdate(
        millId,
        updates,
        { new: true, runValidators: true }
      ).populate('ownerId', 'name email');
      
      if (!mill) {
        return sendResponse(socket, 'admin:mills:update:response', false, null, 'Mill not found', 'MILL_NOT_FOUND');
      }
      
      sendResponse(socket, 'admin:mills:update:response', true, mill);
      logger.info('Super admin updated mill', { userId: user._id, millId });
      
      // Broadcast to all super-admins
      io.to('super-admin').emit('admin:mills:updated', { action: 'updated', mill });
    } catch (error) {
      logger.error('Failed to update mill:', error);
      sendResponse(socket, 'admin:mills:update:response', false, null, error.message, 'UPDATE_MILL_ERROR');
    }
  });
  
  socket.on('admin:mills:delete', async (payload) => {
    try {
      const { millId } = payload;
      
      const mill = await Mill.findByIdAndUpdate(
        millId,
        { status: 'suspended' },
        { new: true }
      );
      
      if (!mill) {
        return sendResponse(socket, 'admin:mills:delete:response', false, null, 'Mill not found', 'MILL_NOT_FOUND');
      }
      
      sendResponse(socket, 'admin:mills:delete:response', true, mill);
      logger.info('Super admin suspended mill', { userId: user._id, millId });
      
      // Broadcast to all super-admins
      io.to('super-admin').emit('admin:mills:updated', { action: 'deleted', mill });
    } catch (error) {
      logger.error('Failed to delete mill:', error);
      sendResponse(socket, 'admin:mills:delete:response', false, null, error.message, 'DELETE_MILL_ERROR');
    }
  });
  
  // Users Management
  socket.on('admin:users:list', async (payload) => {
    try {
      const { page = 1, limit = 10, role, millId, search } = payload || {};
      
      const query = {};
      if (role) query.role = role;
      if (millId) query.millId = millId;
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
        ];
      }
      
      const users = await User.find(query)
        .populate('millId', 'name code')
        .populate('createdBy', 'name email')
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
      
      const total = await User.countDocuments(query);
      
      sendResponse(socket, 'admin:users:list:response', true, {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
      
      logger.info('Super admin listed users', { userId: user._id, count: users.length });
    } catch (error) {
      logger.error('Failed to list users:', error);
      sendResponse(socket, 'admin:users:list:response', false, null, error.message, 'LIST_USERS_ERROR');
    }
  });
  
  socket.on('admin:mill-admins:create', async (payload) => {
    try {
      const millAdmin = await registerUser(
        { ...payload, role: 'mill-admin' },
        user._id
      );
      
      await millAdmin.populate('millId', 'name code');
      
      sendResponse(socket, 'admin:mill-admins:create:response', true, millAdmin);
      logger.info('Super admin created mill-admin', { userId: user._id, millAdminId: millAdmin._id });
    } catch (error) {
      logger.error('Failed to create mill-admin:', error);
      sendResponse(socket, 'admin:mill-admins:create:response', false, null, error.message, 'CREATE_MILL_ADMIN_ERROR');
    }
  });
  
  socket.on('admin:users:status', async (payload) => {
    try {
      const { userId, isActive } = payload;
      
      const targetUser = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
      ).populate('millId', 'name code');
      
      if (!targetUser) {
        return sendResponse(socket, 'admin:users:status:response', false, null, 'User not found', 'USER_NOT_FOUND');
      }
      
      sendResponse(socket, 'admin:users:status:response', true, targetUser);
      logger.info('Super admin updated user status', { 
        userId: user._id, 
        targetUserId: userId, 
        isActive 
      });
    } catch (error) {
      logger.error('Failed to update user status:', error);
      sendResponse(socket, 'admin:users:status:response', false, null, error.message, 'UPDATE_USER_STATUS_ERROR');
    }
  });
  
  // Access mill-admin dashboard
  socket.on('admin:mill:dashboard', async (payload) => {
    try {
      const { millId } = payload;
      
      const mill = await Mill.findById(millId).populate('ownerId', 'name email');
      
      if (!mill) {
        return sendResponse(socket, 'admin:mill:dashboard:response', false, null, 'Mill not found', 'MILL_NOT_FOUND');
      }
      
      // Get mill statistics
      const staffCount = await User.countDocuments({ millId, role: 'mill-staff', isActive: true });
      
      const dashboardData = {
        mill,
        stats: {
          staffCount,
          // Add more stats as needed
        },
      };
      
      sendResponse(socket, 'admin:mill:dashboard:response', true, dashboardData);
      logger.info('Super admin accessed mill dashboard', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to get mill dashboard:', error);
      sendResponse(socket, 'admin:mill:dashboard:response', false, null, error.message, 'GET_MILL_DASHBOARD_ERROR');
    }
  });
  
  // Access mill-staff dashboard
  socket.on('admin:mill-staff:dashboard', async (payload) => {
    try {
      const { millId } = payload;
      
      const mill = await Mill.findById(millId);
      
      if (!mill) {
        return sendResponse(socket, 'admin:mill-staff:dashboard:response', false, null, 'Mill not found', 'MILL_NOT_FOUND');
      }
      
      const staff = await User.find({ millId, role: 'mill-staff' })
        .select('name email permissions isActive lastLogin');
      
      sendResponse(socket, 'admin:mill-staff:dashboard:response', true, { mill, staff });
      logger.info('Super admin accessed mill-staff dashboard', { userId: user._id, millId });
    } catch (error) {
      logger.error('Failed to get mill-staff dashboard:', error);
      sendResponse(socket, 'admin:mill-staff:dashboard:response', false, null, error.message, 'GET_MILL_STAFF_DASHBOARD_ERROR');
    }
  });
};
