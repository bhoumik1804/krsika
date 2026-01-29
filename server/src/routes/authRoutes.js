import express from 'express';
import {
  login,
  googleLogin,
  googleAuth,
  googleCallback,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  loginSchema,
  googleTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/authValidators.js';

const router = express.Router();

// Public routes
router.post('/login', validate(loginSchema), login);
router.post('/google/login', validate(googleTokenSchema), googleLogin);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
