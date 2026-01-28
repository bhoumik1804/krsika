/**
 * Seed Super Admin Script
 * =======================
 * Creates the initial super admin user
 *
 * Usage: node src/scripts/seed-admin.js
 */
import { dirname, join } from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { USER_ROLES } from '../shared/constants/roles.js'
import User from '../shared/models/user.model.js'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../../.env') })

// Super Admin Configuration - Two admins
const SUPER_ADMINS = [
    {
        name: process.env.SUPER_ADMIN_1_NAME,
        email: process.env.SUPER_ADMIN_1_EMAIL,
        password: process.env.SUPER_ADMIN_1_PASSWORD,
        phone: process.env.SUPER_ADMIN_1_PHONE,
        role: USER_ROLES.SUPER_ADMIN,
        isActive: true,
        isEmailVerified: true,
    },
    {
        name: process.env.SUPER_ADMIN_2_NAME,
        email: process.env.SUPER_ADMIN_2_EMAIL,
        password: process.env.SUPER_ADMIN_2_PASSWORD,
        phone: process.env.SUPER_ADMIN_2_PHONE,
        role: USER_ROLES.SUPER_ADMIN,
        isActive: true,
        isEmailVerified: true,
    },
]

async function seedSuperAdmin() {
    try {
        // Connect to MongoDB
        const mongoUri =
            process.env.MONGO_URI ||
            process.env.DATABASE_URI ||
            process.env.MONGODB_URI
        const dbName = process.env.MONGODB_DATABASE_NAME || 'ricemill'

        if (!mongoUri) {
            console.error(
                '❌ MONGO_URI, DATABASE_URI, or MONGODB_URI not found in environment variables'
            )
            process.exit(1)
        }

        const fullUri = mongoUri.includes('?')
            ? `${mongoUri}&dbName=${dbName}`
            : `${mongoUri}/${dbName}`

        console.log('🔌 Connecting to MongoDB...')
        await mongoose.connect(fullUri)
        console.log('✅ Connected to MongoDB')

        let createdCount = 0
        let skippedCount = 0

        console.log('')
        console.log('═══════════════════════════════════════════')
        console.log('       SEEDING SUPER ADMINS')
        console.log('═══════════════════════════════════════════')

        for (const adminData of SUPER_ADMINS) {
            // Check if admin already exists
            const existingAdmin = await User.findOne({ email: adminData.email })

            if (existingAdmin) {
                console.log(
                    `ℹ️  [${adminData.email}] Already exists - Skipping`
                )
                skippedCount++
            } else {
                // Create super admin
                const superAdmin = new User(adminData)
                await superAdmin.save()

                console.log(`✅ [${adminData.email}] Created successfully`)
                console.log(`   Name: ${adminData.name}`)
                console.log(`   Password: ${adminData.password}`)
                createdCount++
            }
        }

        console.log('═══════════════════════════════════════════')
        console.log('')
        console.log(
            `📊 Summary: ${createdCount} created, ${skippedCount} skipped`
        )

        if (createdCount > 0) {
            console.log('⚠️  Please change passwords after first login!')
        }

        // Disconnect from MongoDB
        await mongoose.disconnect()
        console.log('🔌 Disconnected from MongoDB')

        process.exit(0)
    } catch (error) {
        console.error('❌ Error seeding super admin:', error.message)

        if (error.code === 11000) {
            console.error('   A user with this email already exists')
        }

        await mongoose.disconnect()
        process.exit(1)
    }
}

// Run the seed function
seedSuperAdmin()
