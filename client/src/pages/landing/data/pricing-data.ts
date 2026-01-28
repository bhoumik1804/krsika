import { type PricingPlan } from '@/types'

export const pricingData = {
    badge: 'Pricing',
    title: 'Simple, Transparent Pricing',
    description:
        'Choose the plan that fits your mill size. No hidden fees, cancel anytime. All plans include a 14-day free trial.',
    fallbackPlans: [
        {
            id: '1',
            name: 'Basic',
            slug: 'basic',
            description:
                'Perfect for small mills getting started with digital operations',
            price: 999,
            billingCycle: 'monthly',
            features: [
                'Single mill management',
                'Up to 5 staff accounts',
                'Basic inventory tracking',
                'Purchase & sales records',
                'Standard reports',
                'Email support',
            ],
            limits: {
                maxStaff: 5,
                maxCustomers: 100,
                maxFarmers: 200,
                maxStorageGB: 5,
            },
            isPopular: false,
        },
        {
            id: '2',
            name: 'Professional',
            slug: 'professional',
            description:
                'For growing mills that need advanced features and analytics',
            price: 2499,
            billingCycle: 'monthly',
            features: [
                'Everything in Basic',
                'Up to 15 staff accounts',
                'Advanced inventory with batch tracking',
                'Processing & milling module',
                'Customer & farmer CRM',
                'Advanced analytics & reports',
                'GST-compliant invoicing',
                'Priority phone support',
            ],
            limits: {
                maxStaff: 15,
                maxCustomers: 500,
                maxFarmers: 1000,
                maxStorageGB: 25,
            },
            isPopular: true,
        },
        {
            id: '3',
            name: 'Enterprise',
            slug: 'enterprise',
            description: 'For large mills and multi-location operations',
            price: 4999,
            billingCycle: 'monthly',
            features: [
                'Everything in Professional',
                'Unlimited staff accounts',
                'Multi-mill management',
                'Custom integrations',
                'API access',
                'Dedicated account manager',
                'On-site training',
                '24/7 priority support',
                'Custom report builder',
            ],
            limits: {
                maxStaff: -1,
                maxCustomers: -1,
                maxFarmers: -1,
                maxStorageGB: 100,
            },
            isPopular: false,
        },
    ] as PricingPlan[],
}
