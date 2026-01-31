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
    millId: string,
    staffId: string
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
                    url: `/staff/${millId}/${staffId}`,
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            title: 'Staff',
            items: [
                {
                    title: 'Staff Directory',
                    url: `/staff/${millId}/${staffId}/manage/staff`,
                    icon: UserCog,
                },
            ],
        },
        {
            title: 'Purchase Reports',
            items: [
                {
                    title: 'Paddy Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/paddy/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Rice Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/rice/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Gunny Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/gunny/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'FRK Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/frk/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Other Purchase Report',
                    url: `/staff/${millId}/${staffId}/purchases/other/report`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Sales Reports',
            items: [
                {
                    title: 'Rice Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/rice/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Paddy Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/paddy/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Gunny Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/gunny/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Khanda Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/khanda/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Nakkhi Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/nakkhi/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Other Sales Report',
                    url: `/staff/${millId}/${staffId}/sales/other/report`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Input Reports',
            items: [
                {
                    title: 'Party Report',
                    url: `/staff/${millId}/${staffId}/input/reports/party`,
                    icon: FileBarChart,
                },
                {
                    title: 'Transporter Report',
                    url: `/staff/${millId}/${staffId}/input/reports/transporter`,
                    icon: FileBarChart,
                },
                {
                    title: 'Broker Report',
                    url: `/staff/${millId}/${staffId}/input/reports/broker`,
                    icon: FileBarChart,
                },
                {
                    title: 'Committee Report',
                    url: `/staff/${millId}/${staffId}/input/reports/committee`,
                    icon: FileBarChart,
                },
                {
                    title: 'DO Report',
                    url: `/staff/${millId}/${staffId}/input/reports/do`,
                    icon: FileBarChart,
                },
                {
                    title: 'Vehicle Report',
                    url: `/staff/${millId}/${staffId}/input/reports/vehicle`,
                    icon: FileBarChart,
                },
                {
                    title: 'Staff Report',
                    url: `/staff/${millId}/${staffId}/input/reports/staff`,
                    icon: FileBarChart,
                },
                {
                    title: 'Labour Group Report',
                    url: `/staff/${millId}/${staffId}/input/reports/labour-group`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Daily Reports',
            items: [
                {
                    title: 'Reports Overview',
                    url: `/staff/${millId}/${staffId}/daily/reports`,
                    icon: FileBarChart,
                },
                {
                    title: 'Receipt',
                    url: `/staff/${millId}/${staffId}/daily/reports/receipt`,
                    icon: FileBarChart,
                },
                {
                    title: 'Payment',
                    url: `/staff/${millId}/${staffId}/daily/reports/payment`,
                    icon: FileBarChart,
                },
            ],
        },
        {
            title: 'Stock Reports',
            items: [
                {
                    title: 'Stock Overview',
                    url: `/staff/${millId}/${staffId}/stock/overview/report`,
                    icon: Package,
                },
            ],
        },
        {
            title: 'Transaction',
            items: [
                {
                    title: "Broker's Transaction",
                    url: `/staff/${millId}/${staffId}/transaction/broker`,
                    icon: ArrowLeftRight,
                },
                {
                    title: "Party's Transaction",
                    url: `/staff/${millId}/${staffId}/transaction/party`,
                    icon: ArrowLeftRight,
                },
            ],
        },
        {
            title: 'Balance Lifting of Purchases',
            items: [
                {
                    title: 'Report on Balance Lifting of Paddy Purchases',
                    url: `/staff/${millId}/${staffId}/balance/lifting/report/purchases/paddy`,
                    icon: ShoppingCart,
                },
                {
                    title: 'Report on Balance Lifting of Rice Purchases',
                    url: `/staff/${millId}/${staffId}/balance/lifting/report/purchases/rice`,
                    icon: ShoppingCart,
                },
                {
                    title: 'Report on Balance Lifting of Gunny Purchases',
                    url: `/staff/${millId}/${staffId}/balance/lifting/report/purchases/gunny`,
                    icon: ShoppingCart,
                },
                {
                    title: 'Report on Balance Lifting of FRK Purchases',
                    url: `/staff/${millId}/${staffId}/balance/lifting/report/purchases/frk`,
                    icon: ShoppingCart,
                },
            ],
        },
        {
            title: 'Balance Lifting of Sales',
            items: [
                {
                    title: 'Report on Balance Lifting of Paddy Sales from Mill',
                    url: `/staff/${millId}/${staffId}/balance/lifting/report/sales/paddy`,
                    icon: Receipt,
                },
            ],
        },
        {
            title: 'Outward Balance Lifting of Rice Sales',
            items: [
                {
                    title: 'Outward Balance Lifting Report of Rice Sales',
                    url: `/staff/${millId}/${staffId}/outward/balance/lifting/report/rice`,
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
                            url: `/staff/${millId}/${staffId}/inward/govt/paddy/report`,
                        },
                        {
                            title: 'Private Paddy Inward Report',
                            url: `/staff/${millId}/${staffId}/inward/private/paddy/report`,
                        },
                        {
                            title: 'Rice Inward Report',
                            url: `/staff/${millId}/${staffId}/inward/rice/report`,
                        },
                        {
                            title: 'Gunny Inward Report',
                            url: `/staff/${millId}/${staffId}/inward/gunny/report`,
                        },
                        {
                            title: 'Other Inward Report',
                            url: `/staff/${millId}/${staffId}/inward/other/report`,
                        },
                        {
                            title: 'FRK Inward Report',
                            url: `/staff/${millId}/${staffId}/inward/frk/report`,
                        },
                    ],
                },
                {
                    title: 'Outward',
                    icon: ArrowRightFromLine,
                    items: [
                        {
                            title: 'Private Paddy Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/private/paddy/report`,
                        },
                        {
                            title: 'Private Rice Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/private/rice/report`,
                        },
                        {
                            title: 'Govt Rice Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/govt/rice/report`,
                        },
                        {
                            title: 'Govt Gunny Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/govt/gunny/report`,
                        },
                        {
                            title: 'Private Gunny Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/private/gunny/report`,
                        },
                        {
                            title: 'FRK Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/frk/report`,
                        },
                        {
                            title: 'Khanda Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/khanda/report`,
                        },
                        {
                            title: 'Nakkhi Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/nakkhi/report`,
                        },
                        {
                            title: 'Bhusa Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/bhusa/report`,
                        },
                        {
                            title: 'Kodha Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/kodha/report`,
                        },
                        {
                            title: 'Silky Kodha Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/silky-kodha/report`,
                        },
                        {
                            title: 'Other Outward Report',
                            url: `/staff/${millId}/${staffId}/outward/other/report`,
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
                    url: `/staff/${millId}/${staffId}/milling/paddy/report`,
                    icon: BarChart3,
                },
                {
                    title: 'Rice Milling Report',
                    url: `/staff/${millId}/${staffId}/milling/rice/report`,
                    icon: BarChart3,
                },
            ],
        },
        {
            title: 'Labour Cost Report',
            items: [
                {
                    title: 'Inward Labour Cost Report',
                    url: `/staff/${millId}/${staffId}/labour/inward/report`,
                    icon: BarChart3,
                },
                {
                    title: 'Outward Labour Cost Report',
                    url: `/staff/${millId}/${staffId}/labour/outward/report`,
                    icon: BarChart3,
                },
                {
                    title: 'Milling Labour Cost Report',
                    url: `/staff/${millId}/${staffId}/labour/milling/report`,
                    icon: BarChart3,
                },
                {
                    title: 'Other Labour Cost Report',
                    url: `/staff/${millId}/${staffId}/labour/other/report`,
                    icon: BarChart3,
                },
            ],
        },
        {
            title: 'Financial Transaction Reports',
            items: [
                {
                    title: 'Financial Receipt Report',
                    url: `/staff/${millId}/${staffId}/financial/transaction/receipt/report`,
                    icon: FileBarChart,
                },
                {
                    title: 'Financial Payment Report',
                    url: `/staff/${millId}/${staffId}/financial/transaction/payment/report`,
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
                            url: `/staff/${millId}/${staffId}/profile`,
                            icon: UserCog,
                        },
                        {
                            title: 'Appearance',
                            url: `/staff/${millId}/${staffId}/settings/appearance`,
                            icon: Palette,
                        },
                    ],
                },
                {
                    title: 'Help',
                    url: `/staff/${millId}/${staffId}/help`,
                    icon: HelpCircle,
                },
            ],
        },
    ],
    profileLinks: [
        {
            title: 'My Profile',
            url: `/staff/${millId}/${staffId}/profile`,
            icon: UserCog,
        },
        {
            title: 'Appearance',
            url: `/staff/${millId}/${staffId}/settings/appearance`,
            icon: Palette,
        },
        {
            title: 'Help',
            url: `/staff/${millId}/${staffId}/help`,
            icon: HelpCircle,
        },
    ],
})
