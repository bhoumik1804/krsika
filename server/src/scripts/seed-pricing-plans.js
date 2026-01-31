/**
 * Seed Pricing Plans
 * Run: node src/scripts/seedPricingPlans.js
 */
import mongoose from 'mongoose'
import 'dotenv/config'
import PricingPlan from '../models/PricingPlan.js'
import logger from '../utils/logger.js'

const seedPricingPlans = async () => {
    try {
        const dbName =
            process.env.NODE_ENV === 'development'
                ? process.env.MONGODB_TEST_DATABASE_NAME
                : process.env.MONGODB_DATABASE_NAME
        await mongoose.connect(process.env.MONGODB_URI, { dbName })
        logger.info('Connected to MongoDB')

        // Clear existing pricing plans
        await PricingPlan.deleteMany({})
        logger.info('Cleared existing pricing plans')

        // Define pricing plans
        const plans = [
            {
                name: 'Starter',
                description:
                    'Perfect for small mills just getting started with digital management',
                price: 999,
                billingCycle: 'monthly',
                features: [
                    'Up to 5 users',
                    'Basic inventory management',
                    'Daily reports',
                    'Email support',
                    '1 mill management',
                ],
                isPopular: false,
                maxUsers: 5,
                maxMills: 1,
                supportLevel: 'email',
                isActive: true,
            },
            {
                name: 'Professional',
                description:
                    'Ideal for growing mills with advanced operational needs',
                price: 4999,
                billingCycle: 'monthly',
                features: [
                    'Up to 25 users',
                    'Advanced inventory management',
                    'Real-time analytics',
                    'Priority email support',
                    'Up to 5 mills',
                    'Custom reports',
                    'API access',
                ],
                isPopular: true,
                maxUsers: 25,
                maxMills: 5,
                supportLevel: 'priority',
                isActive: true,
            },
            {
                name: 'Enterprise',
                description:
                    'Comprehensive solution for large-scale rice mill operations',
                price: 14999,
                billingCycle: 'monthly',
                features: [
                    'Unlimited users',
                    'Enterprise inventory system',
                    'Advanced AI-powered analytics',
                    'Dedicated account manager',
                    'Unlimited mills',
                    'Custom workflows',
                    'API access',
                    'White-label options',
                    'SLA guarantee',
                    'Custom integrations',
                ],
                isPopular: false,
                maxUsers: 999,
                maxMills: 999,
                supportLevel: 'dedicated',
                isActive: true,
            },
            {
                name: 'Starter',
                description:
                    'Perfect for small mills just getting started with digital management',
                price: 9990,
                billingCycle: 'yearly',
                features: [
                    'Up to 5 users',
                    'Basic inventory management',
                    'Daily reports',
                    'Email support',
                    '1 mill management',
                    '20% savings with annual billing',
                ],
                isPopular: false,
                maxUsers: 5,
                maxMills: 1,
                supportLevel: 'email',
                isActive: true,
            },
            {
                name: 'Professional',
                description:
                    'Ideal for growing mills with advanced operational needs',
                price: 49990,
                billingCycle: 'yearly',
                features: [
                    'Up to 25 users',
                    'Advanced inventory management',
                    'Real-time analytics',
                    'Priority email support',
                    'Up to 5 mills',
                    'Custom reports',
                    'API access',
                    '20% savings with annual billing',
                ],
                isPopular: false,
                maxUsers: 25,
                maxMills: 5,
                supportLevel: 'priority',
                isActive: true,
            },
            {
                name: 'Enterprise',
                description:
                    'Comprehensive solution for large-scale rice mill operations',
                price: 149990,
                billingCycle: 'yearly',
                features: [
                    'Unlimited users',
                    'Enterprise inventory system',
                    'Advanced AI-powered analytics',
                    'Dedicated account manager',
                    'Unlimited mills',
                    'Custom workflows',
                    'API access',
                    'White-label options',
                    'SLA guarantee',
                    'Custom integrations',
                    '20% savings with annual billing',
                ],
                isPopular: false,
                maxUsers: 999,
                maxMills: 999,
                supportLevel: 'dedicated',
                isActive: true,
            },
        ]

        // Insert pricing plans
        const result = await PricingPlan.insertMany(plans)
        logger.info(`Successfully seeded ${result.length} pricing plans`, {
            plans: result.map((p) => ({
                name: p.name,
                billingCycle: p.billingCycle,
            })),
        })

        console.log('✅ Pricing plans seeded successfully!')
        process.exit(0)
    } catch (error) {
        logger.error('Error seeding pricing plans:', error)
        console.error('❌ Error seeding pricing plans:', error.message)
        process.exit(1)
    }
}

seedPricingPlans()
