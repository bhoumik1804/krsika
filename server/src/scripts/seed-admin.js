import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import logger from '../utils/logger.js';

dotenv.config();

const seedSuperAdmins = async () => {
  try {
    // Connect to database
    const dbName = process.env.MONGODB_DATABASE_NAME;
    await mongoose.connect(process.env.MONGODB_URI, { dbName });
    
    logger.info('Connected to database for seeding');
    
    const admins = [
      {
        name: process.env.SUPER_ADMIN_1_NAME,
        email: process.env.SUPER_ADMIN_1_EMAIL,
        password: process.env.SUPER_ADMIN_1_PASSWORD,
        phone: process.env.SUPER_ADMIN_1_PHONE,
      },
      {
        name: process.env.SUPER_ADMIN_2_NAME,
        email: process.env.SUPER_ADMIN_2_EMAIL,
        password: process.env.SUPER_ADMIN_2_PASSWORD,
        phone: process.env.SUPER_ADMIN_2_PHONE,
      },
    ];
    
    for (const admin of admins) {
      if (!admin.email || !admin.password) {
        logger.warn('Skipping admin seed: missing email or password');
        continue;
      }
      
      const existingAdmin = await User.findOne({ email: admin.email });
      
      if (existingAdmin) {
        logger.info(`Super admin already exists: ${admin.email}`);
        continue;
      }
      
      const hashedPassword = await bcrypt.hash(admin.password, 12);
      
      await User.create({
        email: admin.email,
        password: hashedPassword,
        name: admin.name || 'Super Admin',
        phone: admin.phone,
        role: 'super-admin',
        isActive: true,
      });
      
      logger.info(`Super admin created successfully: ${admin.email}`);
    }
    
    await mongoose.connection.close();
    logger.info('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedSuperAdmins();
