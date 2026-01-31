import mongoose from 'mongoose'
import 'dotenv/config'
import { ROLES } from '../constants/user.roles.enum.js'
import { User } from '../models/user.model.js'
import logger from '../utils/logger.js'

const seedSuperAdmins = async () => {
    try {
        // Connect to database
        const dbName =
            process.env.NODE_ENV === 'development'
                ? process.env.MONGODB_TEST_DATABASE_NAME
                : process.env.MONGODB_DATABASE_NAME
        await mongoose.connect(process.env.MONGODB_URI, { dbName })

        logger.info('Connected to database for seeding')

        const admins = [
            {
                fullName: process.env.SUPER_ADMIN_1_NAME,
                email: process.env.SUPER_ADMIN_1_EMAIL,
                password: process.env.SUPER_ADMIN_1_PASSWORD,
                // phone: process.env.SUPER_ADMIN_1_PHONE,
            },
            {
                fullName: process.env.SUPER_ADMIN_2_NAME,
                email: process.env.SUPER_ADMIN_2_EMAIL,
                password: process.env.SUPER_ADMIN_2_PASSWORD,
                // phone: process.env.SUPER_ADMIN_2_PHONE,
            },
        ]

        for (const admin of admins) {
            if (!admin.email || !admin.password) {
                logger.warn('Skipping admin seed: missing email or password')
                continue
            }

            const existingAdmin = await User.findOne({ email: admin.email })

            if (existingAdmin) {
                logger.info(`Super admin already exists: ${admin.email}`)
                continue
            }

            await User.create({
                email: admin.email,
                password: admin.password,
                fullName: admin.fullName,
                // phone: admin.phone,
                role: ROLES.SUPER_ADMIN,
                isActive: true,
            })

            logger.info(`Super admin created successfully: ${admin.email}`)
        }

        await mongoose.connection.close()
        logger.info('Database connection closed')

        process.exit(0)
    } catch (error) {
        logger.error('Seeding failed:', error)
        process.exit(1)
    }
}

seedSuperAdmins()
