import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
} from './tokenService.js';

export const findOrCreateGoogleUser = async (profile, userAgent, ipAddress) => {
  try {
    const { id: googleId, emails, displayName, photos } = profile;
    const email = emails[0].value;
    const avatar = photos && photos[0] ? photos[0].value : null;
    
    // Check if user exists with Google ID
    let user = await User.findOne({ googleId });
    
    // If not found by Google ID, check by email
    if (!user) {
      user = await User.findOne({ email });
      
      // If user exists with email but no Google ID, link the account
      if (user) {
        user.googleId = googleId;
        if (!user.avatar && avatar) {
          user.avatar = avatar;
        }
        user.lastLogin = new Date();
        await user.save();
        
        logger.info('Google account linked to existing user', { userId: user._id, email });
      }
    }
    
    // If user still doesn't exist, create a new one
    if (!user) {
      // For new Google users, default to mill-staff role
      // Super-admin or mill-admin should be created manually
      user = await User.create({
        email,
        name: displayName,
        googleId,
        avatar,
        role: 'mill-staff', // Default role
        isActive: false, // Inactive until admin assigns a mill
        lastLogin: new Date(),
      });
      
      logger.info('New Google user created', { userId: user._id, email });
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      logger.info('Google user logged in', { userId: user._id, email });
    }
    
    // Check if user is active
    if (!user.isActive) {
      throw ApiError.forbidden('Account is inactive. Please contact administrator.', 'ACCOUNT_INACTIVE');
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    // Save refresh token
    await saveRefreshToken(user._id, refreshToken, userAgent, ipAddress);
    
    return { user, accessToken, refreshToken };
  } catch (error) {
    logger.error('Google authentication failed:', error);
    throw error;
  }
};

export const verifyGoogleToken = async (token, userAgent, ipAddress) => {
  try {
    // This would integrate with Google OAuth2 client library
    // For now, this is a placeholder
    // In production, you would use google-auth-library to verify the token
    
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    // Create a profile object similar to passport-google-oauth20
    const profile = {
      id: payload.sub,
      emails: [{ value: payload.email }],
      displayName: payload.name,
      photos: payload.picture ? [{ value: payload.picture }] : [],
    };
    
    return await findOrCreateGoogleUser(profile, userAgent, ipAddress);
  } catch (error) {
    logger.error('Google token verification failed:', error);
    throw ApiError.unauthorized('Invalid Google token', 'INVALID_GOOGLE_TOKEN');
  }
};
