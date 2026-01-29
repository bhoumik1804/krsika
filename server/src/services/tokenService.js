import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import RefreshToken from '../models/RefreshToken.js';
import logger from '../utils/logger.js';

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN }
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    logger.error('Access token verification failed:', error);
    throw error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    logger.error('Refresh token verification failed:', error);
    throw error;
  }
};

export const saveRefreshToken = async (userId, token, userAgent, ipAddress) => {
  try {
    const decoded = verifyRefreshToken(token);
    const expiresAt = new Date(decoded.exp * 1000);
    
    await RefreshToken.create({
      token,
      userId,
      expiresAt,
      userAgent,
      ipAddress,
    });
    
    logger.info('Refresh token saved', { userId });
  } catch (error) {
    logger.error('Failed to save refresh token:', error);
    throw error;
  }
};

export const findRefreshToken = async (token) => {
  try {
    const tokens = await RefreshToken.find({ isRevoked: false });
    
    for (const tokenDoc of tokens) {
      const isMatch = await tokenDoc.compareToken(token);
      if (isMatch) {
        return tokenDoc;
      }
    }
    
    return null;
  } catch (error) {
    logger.error('Failed to find refresh token:', error);
    throw error;
  }
};

export const revokeRefreshToken = async (tokenId) => {
  try {
    await RefreshToken.findByIdAndUpdate(tokenId, { isRevoked: true });
    logger.info('Refresh token revoked', { tokenId });
  } catch (error) {
    logger.error('Failed to revoke refresh token:', error);
    throw error;
  }
};

export const revokeAllUserTokens = async (userId) => {
  try {
    await RefreshToken.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
    logger.info('All user tokens revoked', { userId });
  } catch (error) {
    logger.error('Failed to revoke all user tokens:', error);
    throw error;
  }
};

export const cleanupExpiredTokens = async () => {
  try {
    const result = await RefreshToken.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    logger.info(`Cleaned up ${result.deletedCount} expired tokens`);
  } catch (error) {
    logger.error('Failed to cleanup expired tokens:', error);
  }
};
