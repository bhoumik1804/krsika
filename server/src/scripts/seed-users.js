import mongoose from 'mongoose'
import 'dotenv/config'
import { ROLES } from '../constants/user.roles.enum.js'
import { User } from '../models/user.model.js'
import logger from '../utils/logger.js'

const seedUsers = async () => {
    try {
        // Connect to database
        const dbName =
            process.env.NODE_ENV === 'development'
                ? process.env.MONGODB_TEST_DATABASE_NAME
                : process.env.MONGODB_DATABASE_NAME
        await mongoose.connect(process.env.MONGODB_URI, { dbName })

        logger.info('Connected to database for seeding users')

        const usersToSeed = [
            {
                email:
                    process.env.SUPER_ADMIN_1_EMAIL || 'superadmin@example.com',
                password: process.env.SUPER_ADMIN_1_PASSWORD || 'Start@123',
                fullName: 'Super Admin',
                role: ROLES.SUPER_ADMIN,
                isActive: true,
            },
            {
                email: 'milladmin@example.com',
                password: 'Start@123',
                fullName: 'Mill Admin',
                role: ROLES.MILL_ADMIN,
                isActive: true,
            },
            {
                email: 'millstaff@example.com',
                password: 'Start@123',
                fullName: 'Mill Staff',
                role: ROLES.MILL_STAFF,
                isActive: true,
            },
            {
                email: 'guest@example.com',
                password: 'Start@123',
                fullName: 'Guest User',
                role: ROLES.GUEST_USER,
                isActive: true,
            },
        ]

        logger.info('--- Seeding Users ---')

        for (const userData of usersToSeed) {
            const existingUser = await User.findOne({ email: userData.email })

            if (existingUser) {
                logger.info(
                    `User already exists: ${userData.email} (${userData.role})`
                )
                continue
            }

            await User.create(userData)
            logger.info(`Created user: ${userData.email} (${userData.role})`)
            logger.info(
                `Credentials: Email: ${userData.email}, Password: ${userData.password}`
            )
        }

        logger.info('--- Seeding Completed ---')

        await mongoose.connection.close()
        logger.info('Database connection closed')

        process.exit(0)
    } catch (error) {
        logger.error('Seeding users failed:', error)
        process.exit(1)
    }
}

seedUsers()
