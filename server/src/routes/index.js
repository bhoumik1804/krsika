import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
