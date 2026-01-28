import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Receipt,
    UserCog,
    BarChart3,
    Settings,
    Palette,
    HelpCircle,
    FileBarChart,
    Calendar,
    ArrowLeftRight,
    ArrowLeftToLine,
    ArrowBigDown,
    ArrowRightFromLine,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const getMillAdminSidebarData = (millId: string): SidebarData => ({
    user: {
        name: 'Mill Admin',
        email: 'admin@yourmill.com',
        avatar: '/avatars/mill-admin.jpg',
        role: 'mill-admin',
    },
    navGroups: [
        {
            title: 'Overview',
            items: [
                {
                    title: 'Dashboard',
                    url: `/mill/${millId}`,
                    icon: LayoutDashboard,
                },
            ],
        },

        {
            title: 'General',
            items: [
                {
                    title: 'Input Reports',
                    icon: ArrowBigDown,
                    items: [
                        {
                            title: 'Party Report',
                            url: `/mill/${millId}/input/reports/party`,
                            icon: FileBarChart,
                        },
                        {
                            title: 'Transporter Report',
                            url: `/mill/${millId}/input/reports/transporter`,
                            icon: FileBarChart,
                        },
                        {
                            title: 'Broker Report',
                            url: `/mill/${millId}/input/reports/broker`,
                            icon: FileBarChart,
                        },
                        {
                            title: 'Committee Report',
                            url: `/mill/${millId}/input/reports/committee`,
                            icon: FileBarChart,
                        },
                        {
                            title: 'DO Report',
                            url: `/mill/${millId}/input/reports/do`,
                            icon: FileBarChart,
                        },
                        {
                            title: 'Vehicle Report',
                            url: `/mill/${millId}/input/reports/vehicle`,
                            icon: FileBarChart,
                        },
                        {
                            title: 'Staff Report',
                            url: `/mill/${millId}/input/reports/staff`,
                            icon: FileBarChart,
                        },
                        {
                            title: 'Labour Group Report',
                            url: `/mill/${millId}/input/reports/labour-group`,
                            icon: FileBarChart,
                        },
                    ],
                },
                {
                    title: 'Daily Reports',
                    icon: FileBarChart,
                    items: [
                        {
                            title: 'Purchase Deals',
                            url: `/mill/${millId}/daily/reports/purchase`,
                        },
                        {
                            title: 'Sales Deals',
                            url: `/mill/${millId}/daily/reports/sales`,
                        },
                        {
                            title: 'Inwards',
                            url: `/mill/${millId}/daily/reports/inwards`,
                        },
                        {
                            title: 'Outwards',
                            url: `/mill/${millId}/daily/reports/outwards`,
                        },
                        {
                            title: 'Milling',
                            url: `/mill/${millId}/daily/reports/milling`,
                        },
                        {
                            title: 'Production',
                            url: `/mill/${millId}/daily/reports/production`,
                        },
                        {
                            title: 'Receipt',
                            url: `/mill/${millId}/daily/reports/receipt`,
                        },
                        {
                            title: 'Payment',
                            url: `/mill/${millId}/daily/reports/payment`,
                        },
                    ],
                },
                {
                    title: 'Stock Reports',
                    icon: Package,
                    items: [
                        {
                            title: 'Stock Overview',
                            url: `/mill/${millId}/stock/overview/report`,
                        },
                    ],
                },
                {
                    title: 'Transaction',
                    icon: ArrowLeftRight,
                    items: [
                        {
                            title: "Broker's Transaction",
                            url: `/mill/${millId}/transaction/broker`,
                        },
                        {
                            title: "Party's Transaction",
                            url: `/mill/${millId}/transaction/party`,
                        },
                    ],
                },
                {
                    title: 'Purchases Reports',
                    icon: ShoppingCart,
                    items: [
                        {
                            title: 'Paddy Purchase Report',
                            url: `/mill/${millId}/purchases/paddy/report`,
                        },
                        {
                            title: 'Rice Purchase Report',
                            url: `/mill/${millId}/purchases/rice/report`,
                        },
                        {
                            title: 'Gunny Purchase Report',
                            url: `/mill/${millId}/purchases/gunny/report`,
                        },
                        {
                            title: 'FRK Purchase Report',
                            url: `/mill/${millId}/purchases/frk/report`,
                        },
                        {
                            title: 'Other Purchase Report',
                            url: `/mill/${millId}/purchases/other/report`,
                        },
                    ],
                },
                {
                    title: 'Balance Lifting of Purchases',
                    icon: ShoppingCart,
                    items: [
                        {
                            title: 'Report on Balance Lifting of Paddy Purchases',
                            url: `/mill/${millId}/balance/lifting/report/purchases/paddy`,
                        },
                        {
                            title: 'Report on Balance Lifting of Rice Purchases',
                            url: `/mill/${millId}/balance/lifting/report/purchases/rice`,
                        },
                        {
                            title: 'Report on Balance Lifting of Gunny Purchases',
                            url: `/mill/${millId}/balance/lifting/report/purchases/gunny`,
                        },
                        {
                            title: 'Report on Balance Lifting of FRK Purchases',
                            url: `/mill/${millId}/balance/lifting/report/purchases/frk`,
                        },
                    ],
                },
                {
                    title: 'Sales Reports',
                    icon: Receipt,
                    items: [
                        {
                            title: 'DO Sales Report',
                            url: `/mill/${millId}/sales/do/report`,
                        },
                        {
                            title: 'Paddy Sales Report (from Mill)',
                            url: `/mill/${millId}/sales/paddy/report`,
                        },
                        {
                            title: 'Rice Sales Report',
                            url: `/mill/${millId}/sales/rice/report`,
                        },
                        {
                            title: 'Gunny Sales Report',
                            url: `/mill/${millId}/sales/gunny/report`,
                        },
                        {
                            title: 'Khanda Sales Report',
                            url: `/mill/${millId}/sales/khanda/report`,
                        },
                        {
                            title: 'Nakkhi Sales Report',
                            url: `/mill/${millId}/sales/nakkhi/report`,
                        },
                        {
                            title: 'Other Sales Report',
                            url: `/mill/${millId}/sales/other/report`,
                        },
                    ],
                },
                {
                    title: 'Balance Lifting of Sales',
                    icon: Receipt,
                    items: [
                        {
                            title: 'Report on Balance Lifting of Paddy Sales from Mill',
                            url: `/mill/${millId}/balance/lifting/report/sales/paddy`,
                        },
                    ],
                },
                {
                    title: 'Outward Balance Lifting of Rice Sales',
                    icon: Receipt,
                    items: [
                        {
                            title: 'Outward Balance Lifting Report of Rice sales',
                            url: `/mill/${millId}/outward/balance/lifting/report/rice`,
                        },
                    ],
                },
            ],
        },
        {
            title: 'Inward & Outward',
            items: [
                {
                    title: 'Inward',
                    icon: ArrowLeftToLine,
                    items: [
                        {
                            title: 'Govt Paddy Inward Report',
                            url: `/mill/${millId}/inward/govt/paddy/report`,
                        },
                        {
                            title: 'Private Paddy Inward Report',
                            url: `/mill/${millId}/inward/private/paddy/report`,
                        },
                        {
                            title: 'Rice Inward Report',
                            url: `/mill/${millId}/inward/rice/report`,
                        },
                        {
                            title: 'Gunny Inward Report',
                            url: `/mill/${millId}/inward/gunny/report`,
                        },
                        {
                            title: 'Other Inward Report',
                            url: `/mill/${millId}/inward/other/report`,
                        },
                        {
                            title: 'FRK Inward Report',
                            url: `/mill/${millId}/inward/frk/report`,
                        },
                    ],
                },
                {
                    title: 'Outward',
                    icon: ArrowRightFromLine,
                    items: [
                        {
                            title: 'Private Paddy Outward Report',
                            url: `/mill/${millId}/outward/private/paddy/report`,
                        },
                        {
                            title: 'Private Rice Outward Report',
                            url: `/mill/${millId}/outward/private/rice/report`,
                        },
                        {
                            title: 'Govt Rice Outward Report',
                            url: `/mill/${millId}/outward/govt/rice/report`,
                        },
                        {
                            title: 'Govt Gunny Outward Report',
                            url: `/mill/${millId}/outward/govt/gunny/report`,
                        },
                        {
                            title: 'Private Gunny Outward Report',
                            url: `/mill/${millId}/outward/private/gunny/report`,
                        },
                        {
                            title: 'FRK Outward Report',
                            url: `/mill/${millId}/outward/frk/report`,
                        },
                        {
                            title: 'Khanda Outward Report',
                            url: `/mill/${millId}/outward/khanda/report`,
                        },
                        {
                            title: 'Nakkhi Outward Report',
                            url: `/mill/${millId}/outward/nakkhi/report`,
                        },
                        {
                            title: 'Bhusa Outward Report',
                            url: `/mill/${millId}/outward/bhusa/report`,
                        },
                        {
                            title: 'Kodha Outward Report',
                            url: `/mill/${millId}/outward/kodha/report`,
                        },
                        {
                            title: 'Silky Kodha Outward Report',
                            url: `/mill/${millId}/outward/silky-kodha/report`,
                        },
                        {
                            title: 'Other Outward Report',
                            url: `/mill/${millId}/outward/other/report`,
                        },
                    ],
                },
            ],
        },
        {
            title: 'Staff Management',
            items: [
                {
                    title: 'All Staff',
                    icon: UserCog,
                    url: `/mill/${millId}/staff`,
                },
                {
                    title: 'Staff Attendance',
                    icon: Calendar,
                    url: `/mill/${millId}/staff/attendance`,
                },
            ],
        },
        {
            title: 'Milling Reports',
            items: [
                {
                    title: 'Paddy Milling Report',
                    icon: BarChart3,
                    url: `/mill/${millId}/milling/paddy/report`,
                },
                {
                    title: 'Rice Milling Report',
                    icon: BarChart3,
                    url: `/mill/${millId}/milling/rice/report`,
                },
            ],
        },
        {
            title: 'Labour Cost Report',
            items: [
                {
                    title: 'Inward Labour Cost Report',
                    icon: BarChart3,
                    url: `/mill/${millId}/labour/inward/report`,
                },
                {
                    title: 'Outward Labour Cost Report',
                    icon: BarChart3,
                    url: `/mill/${millId}/labour/outward/report`,
                },
                {
                    title: 'Milling Labour Cost Report',
                    icon: BarChart3,
                    url: `/mill/${millId}/labour/milling/report`,
                },
                {
                    title: 'Other Labour Cost Report',
                    icon: BarChart3,
                    url: `/mill/${millId}/labour/other/report`,
                },
            ],
        },
        {
            title: 'Financial Transaction Reports',
            items: [
                {
                    title: 'Financial Receipt Report',
                    icon: Settings,
                    url: `/mill/${millId}/financial/transaction/receipt/report`,
                },
                {
                    title: 'Financial Payment Report',
                    icon: Settings,
                    url: `/mill/${millId}/financial/transaction/payment/report`,
                },
            ],
        },

        {
            title: 'Others',
            items: [
                {
                    title: 'Settings',
                    icon: Settings,
                    items: [
                        {
                            title: 'Profile',
                            url: `/mill/${millId}/settings`,
                            icon: UserCog,
                        },
                        {
                            title: 'Appearance',
                            url: `/mill/${millId}/settings/appearance`,
                            icon: Palette,
                        },
                    ],
                },
                {
                    title: 'Help Center',
                    url: `/mill/${millId}/help-center`,
                    icon: HelpCircle,
                },
            ],
        },
    ],
    profileLinks: [
        {
            title: 'Profile',
            url: `/mill/${millId}/settings`,
            icon: UserCog,
        },
        {
            title: 'Appearance',
            url: `/mill/${millId}/settings/appearance`,
            icon: Palette,
        },
    ],
})
