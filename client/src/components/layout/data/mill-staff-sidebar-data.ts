import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Receipt,
    FileBarChart,
    UserCog,
    BarChart3,
    HelpCircle,
    Settings,
    Palette,
    ArrowLeftRight,
    ArrowLeftToLine,
    ArrowRightFromLine,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const getMillStaffSidebarData = (
    millId: string
): SidebarData => ({
    user: {
        name: 'Staff Member',
        email: 'staff@yourmill.com',
        avatar: '/avatars/staff.jpg',
        role: 'mill-staff',
    },
    navGroups: [
        {
            title: 'Dashboard',
            items: [
                {
                    title: 'Overview',
                    url: `/staff/${millId}`,
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            title: 'Staff',
            items: [
                {
                    title: 'Staff Directory',
                    url: `/staff/${millId}/manage/staff`,
                    icon: UserCog,
                },
            ],
        },
        {
            title: 'Purchase Reports',
            items: [
                {
                    title: 'Paddy Purchase Report',
                    url: `/staff/${millId}/purchases/paddy/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Rice Purchase Report',
                    url: `/staff/${millId}/purchases/rice/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Gunny Purchase Report',
                    url: `/staff/${millId}/purchases/gunny/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'FRK Purchase Report',
                    url: `/staff/${millId}/purchases/frk/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Other Purchase Report',
                    url: `/staff/${millId}/purchases/other/report`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Sales Reports',
            items: [
                {
                    title: 'Rice Sales Report',
                    url: `/staff/${millId}/sales/rice/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Paddy Sales Report',
                    url: `/staff/${millId}/sales/paddy/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Gunny Sales Report',
                    url: `/staff/${millId}/sales/gunny/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Khanda Sales Report',
                    url: `/staff/${millId}/sales/khanda/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Nakkhi Sales Report',
                    url: `/staff/${millId}/sales/nakkhi/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Other Sales Report',
                    url: `/staff/${millId}/sales/other/report`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Input Reports',
            items: [
                {
                    title: 'Party Report',
                    url: `/staff/${millId}/input/reports/party`,
                    icon: FileBarChart,
                },
                {
                    title: 'Transporter Report',
                    url: `/staff/${millId}/input/reports/transporter`,
                    icon: FileBarChart,
                },
                {
                    title: 'Broker Report',
                    url: `/staff/${millId}/input/reports/broker`,
                    icon: FileBarChart,
                },
                {
                    title: 'Committee Report',
                    url: `/staff/${millId}/input/reports/committee`,
                    icon: FileBarChart,
                },
                {
                    title: 'DO Report',
                    url: `/staff/${millId}/input/reports/do`,
                    icon: FileBarChart,
                },
                {
                    title: 'Vehicle Report',
                    url: `/staff/${millId}/input/reports/vehicle`,
                    icon: FileBarChart,
                },
                {
                    title: 'Staff Report',
                    url: `/staff/${millId}/input/reports/staff`,
                    icon: FileBarChart,
                },
                {
                    title: 'Labour Group Report',
                    url: `/staff/${millId}/input/reports/labour-group`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Daily Reports',
            items: [
                {
                    title: 'Reports Overview',
                    url: `/staff/${millId}/daily/reports`,
                    icon: FileBarChart,
                },
                {
                    title: 'Receipt',
                    url: `/staff/${millId}/daily/reports/receipt`,
                    icon: FileBarChart,
                },
                {
                    title: 'Payment',
                    url: `/staff/${millId}/daily/reports/payment`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Stock Reports',
            items: [
                {
                    title: 'Stock Overview',
                    url: `/staff/${millId}/stock/overview/report`,
                    icon: Package,
                },
            ],
        },
        {
            title: 'Transaction',
            items: [
                {
                    title: "Broker's Transaction",
                    url: `/staff/${millId}/transaction/broker`,
                    icon: ArrowLeftRight,
                },
                {
                    title: "Party's Transaction",
                    url: `/staff/${millId}/transaction/party`,
                    icon: ArrowLeftRight,
                },
            ],
        },
        {
            title: 'Balance Lifting of Purchases',
            items: [
                {
                    title: 'Report on Balance Lifting of Paddy Purchases',
                    url: `/staff/${millId}/balance/lifting/report/purchases/paddy`,
                    icon: ShoppingCart,
                },
                {
                    title: 'Report on Balance Lifting of Rice Purchases',
                    url: `/staff/${millId}/balance/lifting/report/purchases/rice`,
                    icon: ShoppingCart,
                },
                {
                    title: 'Report on Balance Lifting of Gunny Purchases',
                    url: `/staff/${millId}/balance/lifting/report/purchases/gunny`,
                    icon: ShoppingCart,
                },
                {
                    title: 'Report on Balance Lifting of FRK Purchases',
                    url: `/staff/${millId}/balance/lifting/report/purchases/frk`,
                    icon: ShoppingCart,
                },
            ],
        },
        {
            title: 'Balance Lifting of Sales',
            items: [
                {
                    title: 'Report on Balance Lifting of Paddy Sales from Mill',
                    url: `/staff/${millId}/balance/lifting/report/sales/paddy`,
                    icon: Receipt,
                },
            ],
        },
        {
            title: 'Outward Balance Lifting of Rice Sales',
            items: [
                {
                    title: 'Outward Balance Lifting Report of Rice Sales',
                    url: `/staff/${millId}/outward/balance/lifting/report/rice`,
                    icon: Receipt,
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
                            url: `/staff/${millId}/inward/govt/paddy/report`,
                        },
                        {
                            title: 'Private Paddy Inward Report',
                            url: `/staff/${millId}/inward/private/paddy/report`,
                        },
                        {
                            title: 'Rice Inward Report',
                            url: `/staff/${millId}/inward/rice/report`,
                        },
                        {
                            title: 'Gunny Inward Report',
                            url: `/staff/${millId}/inward/gunny/report`,
                        },
                        {
                            title: 'Other Inward Report',
                            url: `/staff/${millId}/inward/other/report`,
                        },
                        {
                            title: 'FRK Inward Report',
                            url: `/staff/${millId}/inward/frk/report`,
                        },
                    ],
                },
                {
                    title: 'Outward',
                    icon: ArrowRightFromLine,
                    items: [
                        {
                            title: 'Private Paddy Outward Report',
                            url: `/staff/${millId}/outward/private/paddy/report`,
                        },
                        {
                            title: 'Private Rice Outward Report',
                            url: `/staff/${millId}/outward/private/rice/report`,
                        },
                        {
                            title: 'Govt Rice Outward Report',
                            url: `/staff/${millId}/outward/govt/rice/report`,
                        },
                        {
                            title: 'Govt Gunny Outward Report',
                            url: `/staff/${millId}/outward/govt/gunny/report`,
                        },
                        {
                            title: 'Private Gunny Outward Report',
                            url: `/staff/${millId}/outward/private/gunny/report`,
                        },
                        {
                            title: 'FRK Outward Report',
                            url: `/staff/${millId}/outward/frk/report`,
                        },
                        {
                            title: 'Khanda Outward Report',
                            url: `/staff/${millId}/outward/khanda/report`,
                        },
                        {
                            title: 'Nakkhi Outward Report',
                            url: `/staff/${millId}/outward/nakkhi/report`,
                        },
                        {
                            title: 'Bhusa Outward Report',
                            url: `/staff/${millId}/outward/bhusa/report`,
                        },
                        {
                            title: 'Kodha Outward Report',
                            url: `/staff/${millId}/outward/kodha/report`,
                        },
                        {
                            title: 'Silky Kodha Outward Report',
                            url: `/staff/${millId}/outward/silky-kodha/report`,
                        },
                        {
                            title: 'Other Outward Report',
                            url: `/staff/${millId}/outward/other/report`,
                        },
                    ],
                },
            ],
        },
        {
            title: 'Milling Reports',
            items: [
                {
                    title: 'Paddy Milling Report',
                    url: `/staff/${millId}/milling/paddy/report`,
                    icon: BarChart3,
                },
                {
                    title: 'Rice Milling Report',
                    url: `/staff/${millId}/milling/rice/report`,
                    icon: BarChart3,
                },
            ],
        },
        {
            title: 'Labour Cost Report',
            items: [
                {
                    title: 'Inward Labour Cost Report',
                    url: `/staff/${millId}/labour/inward/report`,
                    icon: BarChart3,
                },
                {
                    title: 'Outward Labour Cost Report',
                    url: `/staff/${millId}/labour/outward/report`,
                    icon: BarChart3,
                },
                {
                    title: 'Milling Labour Cost Report',
                    url: `/staff/${millId}/labour/milling/report`,
                    icon: BarChart3,
                },
                {
                    title: 'Other Labour Cost Report',
                    url: `/staff/${millId}/labour/other/report`,
                    icon: BarChart3,
                },
            ],
        },
        {
            title: 'Financial Transaction Reports',
            items: [
                {
                    title: 'Financial Receipt Report',
                    url: `/staff/${millId}/financial/transaction/receipt/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Financial Payment Report',
                    url: `/staff/${millId}/financial/transaction/payment/report`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: Settings,
                    items: [
                        {
                            title: 'Profile',
                            url: `/staff/${millId}/profile`,
                            icon: UserCog,
                        },
                        {
                            title: 'Appearance',
                            url: `/staff/${millId}/settings/appearance`,
                            icon: Palette,
                        },
                    ],
                },
                {
                    title: 'Help',
                    url: `/staff/${millId}/help`,
                    icon: HelpCircle,
                },
            ],
        },
    ],
    profileLinks: [
        {
            title: 'My Profile',
            url: `/staff/${millId}/profile`,
            icon: UserCog,
        },
        {
            title: 'Appearance',
            url: `/staff/${millId}/settings/appearance`,
            icon: Palette,
        },
        {
            title: 'Help',
            url: `/staff/${millId}/help`,
            icon: HelpCircle,
        },
    ],
})
