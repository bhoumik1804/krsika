import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  revokeAllUserTokens,
} from './tokenService.js';

export const registerUser = async (userData, createdBy = null) => {
  try {
    const { email, password, name, phone, role, millId, permissions } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered', 'EMAIL_EXISTS');
    }
    
    // Create user
    const user = await User.create({
      email,
      password,
      name,
      phone,
      role,
      millId,
      permissions: permissions || [],
      createdBy,
    });
    
    logger.info('User registered', { userId: user._id, email: user.email, role: user.role });
    
    return user;
  } catch (error) {
    logger.error('User registration failed:', error);
    throw error;
  }
};

export const loginUser = async (email, password, userAgent, ipAddress) => {
  try {
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    // Check if user is active
    if (!user.isActive) {
      throw ApiError.forbidden('Account is inactive', 'ACCOUNT_INACTIVE');
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    // Save refresh token
    await saveRefreshToken(user._id, refreshToken, userAgent, ipAddress);
    
    logger.info('User logged in', { userId: user._id, email: user.email });
    
    return { user, accessToken, refreshToken };
  } catch (error) {
    logger.error('Login failed:', error);
    throw error;
  }
};

export const logoutUser = async (userId) => {
  try {
    await revokeAllUserTokens(userId);
    logger.info('User logged out', { userId });
  } catch (error) {
    logger.error('Logout failed:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).populate('millId');
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }
    
    return user;
  } catch (error) {
    logger.error('Failed to get user:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const allowedUpdates = ['name', 'phone', 'avatar'];
    const filteredUpdates = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate('millId');
    
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }
    
    logger.info('User profile updated', { userId });
    
    return user;
  } catch (error) {
    logger.error('Failed to update user profile:', error);
    throw error;
  }
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    }
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Current password is incorrect', 'INVALID_PASSWORD');
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Revoke all existing tokens
    await revokeAllUserTokens(userId);
    
    logger.info('User password changed', { userId });
    
    return user;
  } catch (error) {
    logger.error('Failed to change password:', error);
    throw error;
  }
};
