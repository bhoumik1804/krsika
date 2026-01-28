import {
    Package,
    ShoppingCart,
    Receipt,
    Factory,
    BarChart3,
    Users,
    Shield,
    Smartphone,
    type LucideIcon,
} from 'lucide-react'

export interface Feature {
    icon: LucideIcon
    title: string
    description: string
    color: string
}

export const featuresData = {
    badge: 'Features',
    title: 'Everything You Need to Run Your Mill',
    description:
        "Comprehensive tools designed specifically for rice mill operations. From gate entry to final dispatch, we've got you covered.",
    items: [
        {
            icon: Package,
            title: 'Inventory Management',
            description:
                'Track paddy, rice, and by-products in real-time. Auto-update stock levels with every transaction.',
            color: 'text-chart-1',
        },
        {
            icon: ShoppingCart,
            title: 'Purchase Tracking',
            description:
                'Record farmer purchases with gate entry integration. Manage pending payments and purchase history.',
            color: 'text-chart-2',
        },
        {
            icon: Receipt,
            title: 'Sales & Invoicing',
            description:
                'Generate GST-compliant invoices instantly. Track deliveries and customer payments.',
            color: 'text-chart-3',
        },
        {
            icon: Factory,
            title: 'Processing & Milling',
            description:
                'Monitor batch processing with conversion rates. Track output quality and efficiency metrics.',
            color: 'text-chart-4',
        },
        {
            icon: BarChart3,
            title: 'Reports & Analytics',
            description:
                'Visual dashboards for purchase, sales, and inventory. Export reports for accounting and compliance.',
            color: 'text-chart-5',
        },
        {
            icon: Users,
            title: 'Customer & Farmer CRM',
            description:
                'Maintain detailed records of customers and farmers. Track transactions and payment history.',
            color: 'text-primary',
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description:
                'Bank-grade security with daily backups. Your data is safe and always accessible.',
            color: 'text-chart-2',
        },
        {
            icon: Smartphone,
            title: 'Mobile Friendly',
            description:
                'Access your mill data from anywhere. Works on phones, tablets, and desktops.',
            color: 'text-chart-1',
        },
    ],
}
