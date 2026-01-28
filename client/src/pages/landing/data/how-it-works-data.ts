import { UserPlus, Settings, Rocket, HeadphonesIcon } from 'lucide-react'

export interface Step {
    number: number
    icon: React.ElementType
    title: string
    description: string
}

export const howItWorksData = {
    badge: 'How It Works',
    title: 'Get Started in 4 Simple Steps',
    description:
        'We make the transition to digital operations seamless. Most mills are fully operational within a week.',
    steps: [
        {
            number: 1,
            icon: UserPlus,
            title: 'Sign Up & Onboard',
            description:
                'Create your account in minutes. Our team will help you set up your mill profile and import existing data.',
        },
        {
            number: 2,
            icon: Settings,
            title: 'Configure Your Mill',
            description:
                'Add your staff, customers, and farmers. Set up inventory categories, pricing, and preferences.',
        },
        {
            number: 3,
            icon: Rocket,
            title: 'Start Operations',
            description:
                'Begin recording purchases, sales, and processing. Watch your data come to life in real-time dashboards.',
        },
        {
            number: 4,
            icon: HeadphonesIcon,
            title: 'Ongoing Support',
            description:
                'Our support team is always available to help. Get regular updates and new features automatically.',
        },
    ],
}
