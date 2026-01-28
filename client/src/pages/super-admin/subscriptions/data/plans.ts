import { Zap, Star, Crown, LucideIcon } from 'lucide-react'

export interface SubscriptionPlan {
    name: string
    description: string
    price: string
    duration: string
    features: string[]
    icon: LucideIcon
    color: string
    bg: string
    buttonVariant:
        | 'default'
        | 'outline'
        | 'ghost'
        | 'link'
        | 'destructive'
        | 'secondary'
    popular?: boolean
}

export const plans: SubscriptionPlan[] = [
    {
        name: 'Free',
        description: 'Perfect for small mills starting out',
        price: '₹0',
        duration: 'forever',
        features: [
            'Up to 2 staff members',
            'Basic inventory tracking',
            'Daily report generation',
            'Email support',
        ],
        icon: Zap,
        color: 'text-zinc-500',
        bg: 'bg-zinc-500/10',
        buttonVariant: 'outline',
    },
    {
        name: 'Pro',
        description: 'Advanced features for growing businesses',
        price: '₹2,499',
        duration: 'per month',
        features: [
            'Up to 15 staff members',
            'Advanced analytics & charts',
            'SMS/WhatsApp notifications',
            'Unlimited report exports',
            'Priority 24/7 support',
            'Custom branding',
        ],
        icon: Star,
        color: 'text-primary',
        bg: 'bg-primary/10',
        buttonVariant: 'default',
        popular: true,
    },
    {
        name: 'Enterprise',
        description: 'Complete solution for large operations',
        price: '₹9,999',
        duration: 'per month',
        features: [
            'Unlimited staff members',
            'Multiple mill management',
            'Custom API integration',
            'Dedicated account manager',
            'White-label solution',
            'Premium security features',
        ],
        icon: Crown,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        buttonVariant: 'outline',
    },
]
