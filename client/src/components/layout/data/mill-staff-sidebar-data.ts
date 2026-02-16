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

export const getMillStaffSidebarData = (millId: string): SidebarData => ({
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
                    // moduleSlug: 'dashboard-overview',
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
                    moduleSlug: 'staff-directory',
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
                    moduleSlug: 'paddy-purchase-report',
                },
                {
                    title: 'Rice Purchase Report',
                    url: `/staff/${millId}/purchases/rice/report`,
                    icon: FileBarChart,
                    moduleSlug: 'rice-purchase-report',
                },
                {
                    title: 'Gunny Purchase Report',
                    url: `/staff/${millId}/purchases/gunny/report`,
                    icon: FileBarChart,
                    moduleSlug: 'gunny-purchase-report',
                },
                {
                    title: 'FRK Purchase Report',
                    url: `/staff/${millId}/purchases/frk/report`,
                    icon: FileBarChart,
                    moduleSlug: 'frk-purchase-report',
                },
                {
                    title: 'Other Purchase Report',
                    url: `/staff/${millId}/purchases/other/report`,
                    icon: FileBarChart,
                    moduleSlug: 'other-purchase-report',
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
                    moduleSlug: 'rice-sales-report',
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
                    moduleSlug: 'gunny-sales-report',
                },
                {
                    title: 'Khanda Sales Report',
                    url: `/staff/${millId}/sales/khanda/report`,
                    icon: FileBarChart,
                    moduleSlug: 'khanda-sales-report',
                },
                {
                    title: 'Nakkhi Sales Report',
                    url: `/staff/${millId}/sales/nakkhi/report`,
                    icon: FileBarChart,
                    moduleSlug: 'nakkhi-sales-report',
                },
                {
                    title: 'Other Sales Report',
                    url: `/staff/${millId}/sales/other/report`,
                    icon: FileBarChart,
                    moduleSlug: 'other-sales-report',
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
                    moduleSlug: 'party-report',
                },
                {
                    title: 'Transporter Report',
                    url: `/staff/${millId}/input/reports/transporter`,
                    icon: FileBarChart,
                    moduleSlug: 'transporter-report',
                },
                {
                    title: 'Broker Report',
                    url: `/staff/${millId}/input/reports/broker`,
                    icon: FileBarChart,
                    moduleSlug: 'broker-report',
                },
                {
                    title: 'Committee Report',
                    url: `/staff/${millId}/input/reports/committee`,
                    icon: FileBarChart,
                    moduleSlug: 'committee-report',
                },
                {
                    title: 'DO Report',
                    url: `/staff/${millId}/input/reports/do`,
                    icon: FileBarChart,
                    moduleSlug: 'do-report',
                },
                {
                    title: 'Vehicle Report',
                    url: `/staff/${millId}/input/reports/vehicle`,
                    icon: FileBarChart,
                    moduleSlug: 'vehicle-report',
                },
                {
                    title: 'Staff Report',
                    url: `/staff/${millId}/input/reports/staff`,
                    icon: FileBarChart,
                    moduleSlug: 'staff-report',
                },
                {
                    title: 'Labour Group Report',
                    url: `/staff/${millId}/input/reports/labour-group`,
                    icon: FileBarChart,
                    moduleSlug: 'labour-group-report',
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
                    moduleSlug: 'daily-reports-overview',
                },
                {
                    title: 'Purchase Deals',
                    url: `/staff/${millId}/daily/reports/purchase`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-receipt',
                },
                {
                    title: 'Sales Deals',
                    url: `/staff/${millId}/daily/reports/sales`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-payment',
                },
                {
                    title: 'Inwards',
                    url: `/staff/${millId}/daily/reports/inwards`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-reports-overview',
                },
                {
                    title: 'Outwards',
                    url: `/staff/${millId}/daily/reports/outwards`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-reports-overview',
                },
                {
                    title: 'Milling',
                    url: `/staff/${millId}/daily/reports/milling`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-reports-overview',
                },
                {
                    title: 'Production',
                    url: `/staff/${millId}/daily/reports/production`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-reports-overview',
                },
                {
                    title: 'Receipt',
                    url: `/staff/${millId}/daily/reports/receipt`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-receipt',
                },
                {
                    title: 'Payment',
                    url: `/staff/${millId}/daily/reports/payment`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-payment',
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
                    moduleSlug: 'stock-overview',
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
                    moduleSlug: 'broker-transaction',
                },
                {
                    title: "Party's Transaction",
                    url: `/staff/${millId}/transaction/party`,
                    icon: ArrowLeftRight,
                    moduleSlug: 'party-transaction',
                },
            ],
        },
        {
            title: 'sidebar.balanceLiftingPurchases',
            items: [
                {
                    title: 'sidebar.reportBalanceLiftingPaddyPurchases',
                    url: `/staff/${millId}/balance/lifting/report/purchases/paddy`,
                    icon: ShoppingCart,
                    moduleSlug: 'balance-lifting-paddy-purchase',
                },
                {
                    title: 'sidebar.reportBalanceLiftingRicePurchases',
                    url: `/staff/${millId}/balance/lifting/report/purchases/rice`,
                    icon: ShoppingCart,
                    moduleSlug: 'balance-lifting-rice-purchase',
                },
                {
                    title: 'sidebar.reportBalanceLiftingGunnyPurchases',
                    url: `/staff/${millId}/balance/lifting/report/purchases/gunny`,
                    icon: ShoppingCart,
                    moduleSlug: 'balance-lifting-gunny-purchase',
                },
                {
                    title: 'sidebar.reportBalanceLiftingFrkPurchases',
                    url: `/staff/${millId}/balance/lifting/report/purchases/frk`,
                    icon: ShoppingCart,
                    moduleSlug: 'balance-lifting-frk-purchase',
                },
            ],
        },
        {
            title: 'sidebar.balanceLiftingSales',
            items: [
                {
                    title: 'sidebar.reportBalanceLiftingPaddySales',
                    url: `/staff/${millId}/balance/lifting/report/sales/paddy`,
                    icon: Receipt,
                    moduleSlug: 'balance-lifting-paddy-sales',
                },
            ],
        },
        {
            title: 'sidebar.outwardBalanceLiftingRiceSales',
            items: [
                {
                    title: 'sidebar.outwardBalanceLiftingReportRiceSales',
                    url: `/staff/${millId}/outward/balance/lifting/report/rice`,
                    icon: Receipt,
                    moduleSlug: 'outward-balance-lifting-rice-sales',
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
                            moduleSlug: 'inward-govt-paddy',
                        },
                        {
                            title: 'Private Paddy Inward Report',
                            url: `/staff/${millId}/inward/private/paddy/report`,
                            moduleSlug: 'inward-private-paddy',
                        },
                        {
                            title: 'Rice Inward Report',
                            url: `/staff/${millId}/inward/rice/report`,
                            moduleSlug: 'inward-rice',
                        },
                        {
                            title: 'Gunny Inward Report',
                            url: `/staff/${millId}/inward/gunny/report`,
                            moduleSlug: 'inward-gunny',
                        },
                        {
                            title: 'Other Inward Report',
                            url: `/staff/${millId}/inward/other/report`,
                            moduleSlug: 'inward-other',
                        },
                        {
                            title: 'FRK Inward Report',
                            url: `/staff/${millId}/inward/frk/report`,
                            moduleSlug: 'inward-frk',
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
                            moduleSlug: 'outward-private-paddy',
                        },
                        {
                            title: 'Private Rice Outward Report',
                            url: `/staff/${millId}/outward/private/rice/report`,
                            moduleSlug: 'outward-private-rice',
                        },
                        {
                            title: 'Govt Rice Outward Report',
                            url: `/staff/${millId}/outward/govt/rice/report`,
                            moduleSlug: 'outward-govt-rice',
                        },
                        {
                            title: 'Govt Gunny Outward Report',
                            url: `/staff/${millId}/outward/govt/gunny/report`,
                            moduleSlug: 'outward-govt-gunny',
                        },
                        {
                            title: 'Private Gunny Outward Report',
                            url: `/staff/${millId}/outward/private/gunny/report`,
                            moduleSlug: 'outward-private-gunny',
                        },
                        {
                            title: 'FRK Outward Report',
                            url: `/staff/${millId}/outward/frk/report`,
                            moduleSlug: 'outward-frk',
                        },
                        {
                            title: 'Khanda Outward Report',
                            url: `/staff/${millId}/outward/khanda/report`,
                            moduleSlug: 'outward-khanda',
                        },
                        {
                            title: 'Nakkhi Outward Report',
                            url: `/staff/${millId}/outward/nakkhi/report`,
                            moduleSlug: 'outward-nakkhi',
                        },
                        {
                            title: 'Bhusa Outward Report',
                            url: `/staff/${millId}/outward/bhusa/report`,
                            moduleSlug: 'outward-bhusa',
                        },
                        {
                            title: 'Kodha Outward Report',
                            url: `/staff/${millId}/outward/kodha/report`,
                            moduleSlug: 'outward-kodha',
                        },
                        {
                            title: 'Silky Kodha Outward Report',
                            url: `/staff/${millId}/outward/silky-kodha/report`,
                            moduleSlug: 'outward-silky-kodha',
                        },
                        {
                            title: 'Other Outward Report',
                            url: `/staff/${millId}/outward/other/report`,
                            moduleSlug: 'outward-other',
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
                    moduleSlug: 'paddy-milling-report',
                },
                {
                    title: 'Rice Milling Report',
                    url: `/staff/${millId}/milling/rice/report`,
                    icon: BarChart3,
                    moduleSlug: 'rice-milling-report',
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
                    moduleSlug: 'inward-labour-cost-report',
                },
                {
                    title: 'Outward Labour Cost Report',
                    url: `/staff/${millId}/labour/outward/report`,
                    icon: BarChart3,
                    moduleSlug: 'outward-labour-cost-report',
                },
                {
                    title: 'Milling Labour Cost Report',
                    url: `/staff/${millId}/labour/milling/report`,
                    icon: BarChart3,
                    moduleSlug: 'milling-labour-cost-report',
                },
                {
                    title: 'Other Labour Cost Report',
                    url: `/staff/${millId}/labour/other/report`,
                    icon: BarChart3,
                    moduleSlug: 'other-labour-cost-report',
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
                    moduleSlug: 'financial-receipt-report',
                },
                {
                    title: 'Financial Payment Report',
                    url: `/staff/${millId}/financial/transaction/payment/report`,
                    icon: FileBarChart,
                    moduleSlug: 'financial-payment-report',
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
        // {
        //     title: 'Help',
        //     url: `/staff/${millId}/help`,
        //     icon: HelpCircle,
        // },
    ],
})
