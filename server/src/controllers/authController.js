import passport from 'passport';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import {
  loginUser,
  getUserById,
  updateUserProfile,
  changeUserPassword,
} from '../services/authService.js';
import {
  verifyGoogleToken,
  findOrCreateGoogleUser,
} from '../services/googleAuthService.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  findRefreshToken,
  saveRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
} from '../services/tokenService.js';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions,
} from '../config/cookie.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.get('user-agent');
    const ipAddress = req.ip;
    
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password,
      userAgent,
      ipAddress
    );
    
    // Set cookies
    res.cookie('access_token', accessToken, accessTokenCookieOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);
    
    res.status(200).json(ApiResponse.success(user, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userAgent = req.get('user-agent');
    const ipAddress = req.ip;
    
    const { user, accessToken, refreshToken } = await verifyGoogleToken(
      token,
      userAgent,
      ipAddress
    );
    
    // Set cookies
    res.cookie('access_token', accessToken, accessTokenCookieOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);
    
    res.status(200).json(ApiResponse.success(user, 'Google login successful'));
  } catch (error) {
    next(error);
  }
};

export const googleAuth = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    try {
      if (err) {
        logger.error('Google authentication error:', err);
        return res.redirect(`${env.CLIENT_URL}/auth/google-error`);
      }
      
      if (!user) {
        return res.redirect(`${env.CLIENT_URL}/auth/google-error`);
      }
      
      if (!user.isActive) {
        return res.redirect(`${env.CLIENT_URL}/auth/inactive`);
      }
      
      const userAgent = req.get('user-agent');
      const ipAddress = req.ip;
      
      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      
      // Save refresh token
      await saveRefreshToken(user._id, refreshToken, userAgent, ipAddress);
      
      // Set cookies
      res.cookie('access_token', accessToken, accessTokenCookieOptions);
      res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);
      
      // Redirect to client
      res.redirect(`${env.CLIENT_URL}/auth/google-success`);
    } catch (error) {
      logger.error('Google callback error:', error);
      res.redirect(`${env.CLIENT_URL}/auth/google-error`);
    }
  })(req, res, next);
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token not found', 'REFRESH_TOKEN_MISSING');
    }
    
    // Verify token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find token in database
    const tokenDoc = await findRefreshToken(refreshToken);
    
    if (!tokenDoc || tokenDoc.isRevoked) {
      throw ApiError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }
    
    // Get user
    const user = await getUserById(decoded.userId);
    
    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    
    // Revoke old refresh token
    await revokeRefreshToken(tokenDoc._id);
    
    // Save new refresh token
    const userAgent = req.get('user-agent');
    const ipAddress = req.ip;
    await saveRefreshToken(user._id, newRefreshToken, userAgent, ipAddress);
    
    // Set new cookies
    res.cookie('access_token', newAccessToken, accessTokenCookieOptions);
    res.cookie('refresh_token', newRefreshToken, refreshTokenCookieOptions);
    
    res.status(200).json(ApiResponse.success({ user }, 'Token refreshed'));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await revokeAllUserTokens(req.user._id);
    
    // Clear cookies
    res.clearCookie('access_token', clearCookieOptions);
    res.clearCookie('refresh_token', { ...clearCookieOptions, path: '/api/auth/refresh' });
    
    res.status(200).json(ApiResponse.success(null, 'Logout successful'));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);
    res.status(200).json(ApiResponse.success(user));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await updateUserProfile(req.user._id, req.body);
    res.status(200).json(ApiResponse.success(user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    await changeUserPassword(req.user._id, currentPassword, newPassword);
    
    // Revoke all tokens, user needs to login again
    res.clearCookie('access_token', clearCookieOptions);
    res.clearCookie('refresh_token', { ...clearCookieOptions, path: '/api/auth/refresh' });
    
    res.status(200).json(
      ApiResponse.success(null, 'Password changed successfully. Please login again.')
    );
  } catch (error) {
    next(error);
  }
};
