import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Receipt,
    FileBarChart,
    UserCog,
    BarChart3,
    // HelpCircle,
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
            title: 'sidebar.dashboard',
            items: [
                {
                    title: 'sidebar.overview',
                    url: `/staff/${millId}`,
                    icon: LayoutDashboard,
                    // moduleSlug: 'dashboard-overview',
                },
            ],
        },
        {
            title: 'sidebar.staff',
            items: [
                {
                    title: 'sidebar.staffDirectory',
                    url: `/staff/${millId}/manage/staff`,
                    icon: UserCog,
                    moduleSlug: 'staff-directory',
                },
            ],
        },
        {
            title: 'sidebar.purchaseReports',
            items: [
                {
                    title: 'sidebar.paddyPurchaseReport',
                    url: `/staff/${millId}/purchases/paddy/report`,
                    icon: FileBarChart,
                    moduleSlug: 'paddy-purchase-report',
                },
                {
                    title: 'sidebar.ricePurchaseReport',
                    url: `/staff/${millId}/purchases/rice/report`,
                    icon: FileBarChart,
                    moduleSlug: 'rice-purchase-report',
                },
                {
                    title: 'sidebar.gunnyPurchaseReport',
                    url: `/staff/${millId}/purchases/gunny/report`,
                    icon: FileBarChart,
                    moduleSlug: 'gunny-purchase-report',
                },
                {
                    title: 'sidebar.frkPurchaseReport',
                    url: `/staff/${millId}/purchases/frk/report`,
                    icon: FileBarChart,
                    moduleSlug: 'frk-purchase-report',
                },
                {
                    title: 'sidebar.otherPurchaseReport',
                    url: `/staff/${millId}/purchases/other/report`,
                    icon: FileBarChart,
                    moduleSlug: 'other-purchase-report',
                },
            ],
        },
        {
            title: 'sidebar.salesReports',
            items: [
                {
                    title: 'sidebar.riceSalesReport',
                    url: `/staff/${millId}/sales/rice/report`,
                    icon: FileBarChart,
                    moduleSlug: 'rice-sales-report',
                },
                {
                    title: 'sidebar.paddySalesReport',
                    url: `/staff/${millId}/sales/paddy/report`,
                    icon: FileBarChart,
                    moduleSlug: 'paddy-sales-report',
                },
                {
                    title: 'sidebar.gunnySalesReport',
                    url: `/staff/${millId}/sales/gunny/report`,
                    icon: FileBarChart,
                    moduleSlug: 'gunny-sales-report',
                },
                {
                    title: 'sidebar.khandaSalesReport',
                    url: `/staff/${millId}/sales/khanda/report`,
                    icon: FileBarChart,
                    moduleSlug: 'khanda-sales-report',
                },
                {
                    title: 'sidebar.nakkhiSalesReport',
                    url: `/staff/${millId}/sales/nakkhi/report`,
                    icon: FileBarChart,
                    moduleSlug: 'nakkhi-sales-report',
                },
                {
                    title: 'sidebar.otherSalesReport',
                    url: `/staff/${millId}/sales/other/report`,
                    icon: FileBarChart,
                    moduleSlug: 'other-sales-report',
                },
            ],
        },
        {
            title: 'sidebar.inputReports',
            items: [
                {
                    title: 'sidebar.partyReport',
                    url: `/staff/${millId}/input/reports/party`,
                    icon: FileBarChart,
                    moduleSlug: 'party-report',
                },
                {
                    title: 'sidebar.transporterReport',
                    url: `/staff/${millId}/input/reports/transporter`,
                    icon: FileBarChart,
                    moduleSlug: 'transporter-report',
                },
                {
                    title: 'sidebar.brokerReport',
                    url: `/staff/${millId}/input/reports/broker`,
                    icon: FileBarChart,
                    moduleSlug: 'broker-report',
                },
                {
                    title: 'sidebar.committeeReport',
                    url: `/staff/${millId}/input/reports/committee`,
                    icon: FileBarChart,
                    moduleSlug: 'committee-report',
                },
                {
                    title: 'sidebar.doReport',
                    url: `/staff/${millId}/input/reports/do`,
                    icon: FileBarChart,
                    moduleSlug: 'do-report',
                },
                {
                    title: 'sidebar.vehicleReport',
                    url: `/staff/${millId}/input/reports/vehicle`,
                    icon: FileBarChart,
                    moduleSlug: 'vehicle-report',
                },
                {
                    title: 'sidebar.staffReport',
                    url: `/staff/${millId}/input/reports/staff`,
                    icon: FileBarChart,
                    moduleSlug: 'staff-report',
                },
                {
                    title: 'sidebar.labourGroupReport',
                    url: `/staff/${millId}/input/reports/labour-group`,
                    icon: FileBarChart,
                    moduleSlug: 'labour-group-report',
                },
            ],
        },
        {
            title: 'sidebar.dailyReports',
            items: [
                {
                    title: 'sidebar.purchaseDeals',
                    url: `/staff/${millId}/daily/reports/purchase`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-receipt',
                },
                {
                    title: 'sidebar.salesDeals',
                    url: `/staff/${millId}/daily/reports/sales`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-payment',
                },
                {
                    title: 'sidebar.inwards',
                    url: `/staff/${millId}/daily/reports/inwards`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-reports-overview',
                },
                {
                    title: 'sidebar.outwards',
                    url: `/staff/${millId}/daily/reports/outwards`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-reports-overview',
                },
                {
                    title: 'sidebar.milling',
                    url: `/staff/${millId}/daily/reports/milling`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-reports-overview',
                },
                {
                    title: 'sidebar.production',
                    url: `/staff/${millId}/daily/reports/production`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-reports-overview',
                },
                {
                    title: 'sidebar.receipt',
                    url: `/staff/${millId}/daily/reports/receipt`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-receipt',
                },
                {
                    title: 'sidebar.payment',
                    url: `/staff/${millId}/daily/reports/payment`,
                    icon: FileBarChart,
                    moduleSlug: 'daily-payment',
                },
            ],
        },
        {
            title: 'sidebar.stockReports',
            items: [
                {
                    title: 'sidebar.stockOverview',
                    url: `/staff/${millId}/stock/overview/report`,
                    icon: Package,
                    moduleSlug: 'stock-overview',
                },
            ],
        },
        {
            title: 'sidebar.transaction',
            items: [
                {
                    title: 'sidebar.brokerTransaction',
                    url: `/staff/${millId}/transaction/broker`,
                    icon: ArrowLeftRight,
                    moduleSlug: 'broker-transaction',
                },
                {
                    title: 'sidebar.partyTransaction',
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
            title: 'sidebar.inwardAndOutward',
            items: [
                {
                    title: 'sidebar.inward',
                    icon: ArrowLeftToLine,
                    items: [
                        {
                            title: 'sidebar.govtPaddyInwardReport',
                            url: `/staff/${millId}/inward/govt/paddy/report`,
                            moduleSlug: 'inward-govt-paddy',
                        },
                        {
                            title: 'sidebar.privatePaddyInwardReport',
                            url: `/staff/${millId}/inward/private/paddy/report`,
                            moduleSlug: 'inward-private-paddy',
                        },
                        {
                            title: 'sidebar.riceInwardReport',
                            url: `/staff/${millId}/inward/rice/report`,
                            moduleSlug: 'inward-rice',
                        },
                        {
                            title: 'sidebar.gunnyInwardReport',
                            url: `/staff/${millId}/inward/gunny/report`,
                            moduleSlug: 'inward-gunny',
                        },
                        {
                            title: 'sidebar.otherInwardReport',
                            url: `/staff/${millId}/inward/other/report`,
                            moduleSlug: 'inward-other',
                        },
                        {
                            title: 'sidebar.frkInwardReport',
                            url: `/staff/${millId}/inward/frk/report`,
                            moduleSlug: 'inward-frk',
                        },
                    ],
                },
                {
                    title: 'sidebar.outward',
                    icon: ArrowRightFromLine,
                    items: [
                        {
                            title: 'sidebar.privatePaddyOutwardReport',
                            url: `/staff/${millId}/outward/private/paddy/report`,
                            moduleSlug: 'outward-private-paddy',
                        },
                        {
                            title: 'sidebar.privateRiceOutwardReport',
                            url: `/staff/${millId}/outward/private/rice/report`,
                            moduleSlug: 'outward-private-rice',
                        },
                        {
                            title: 'sidebar.govtRiceOutwardReport',
                            url: `/staff/${millId}/outward/govt/rice/report`,
                            moduleSlug: 'outward-govt-rice',
                        },
                        {
                            title: 'sidebar.govtGunnyOutwardReport',
                            url: `/staff/${millId}/outward/govt/gunny/report`,
                            moduleSlug: 'outward-govt-gunny',
                        },
                        {
                            title: 'sidebar.privateGunnyOutwardReport',
                            url: `/staff/${millId}/outward/private/gunny/report`,
                            moduleSlug: 'outward-private-gunny',
                        },
                        {
                            title: 'sidebar.frkOutwardReport',
                            url: `/staff/${millId}/outward/frk/report`,
                            moduleSlug: 'outward-frk',
                        },
                        {
                            title: 'sidebar.khandaOutwardReport',
                            url: `/staff/${millId}/outward/khanda/report`,
                            moduleSlug: 'outward-khanda',
                        },
                        {
                            title: 'sidebar.nakkhiOutwardReport',
                            url: `/staff/${millId}/outward/nakkhi/report`,
                            moduleSlug: 'outward-nakkhi',
                        },
                        {
                            title: 'sidebar.bhusaOutwardReport',
                            url: `/staff/${millId}/outward/bhusa/report`,
                            moduleSlug: 'outward-bhusa',
                        },
                        {
                            title: 'sidebar.kodhaOutwardReport',
                            url: `/staff/${millId}/outward/kodha/report`,
                            moduleSlug: 'outward-kodha',
                        },
                        {
                            title: 'sidebar.silkyKodhaOutwardReport',
                            url: `/staff/${millId}/outward/silky-kodha/report`,
                            moduleSlug: 'outward-silky-kodha',
                        },
                        {
                            title: 'sidebar.otherOutwardReport',
                            url: `/staff/${millId}/outward/other/report`,
                            moduleSlug: 'outward-other',
                        },
                    ],
                },
            ],
        },
        {
            title: 'sidebar.millingReports',
            items: [
                {
                    title: 'sidebar.paddyMillingReport',
                    url: `/staff/${millId}/milling/paddy/report`,
                    icon: BarChart3,
                    moduleSlug: 'paddy-milling-report',
                },
                {
                    title: 'sidebar.riceMillingReport',
                    url: `/staff/${millId}/milling/rice/report`,
                    icon: BarChart3,
                    moduleSlug: 'rice-milling-report',
                },
            ],
        },
        {
            title: 'sidebar.labourCostReport',
            items: [
                {
                    title: 'sidebar.inwardLabourCostReport',
                    url: `/staff/${millId}/labour/inward/report`,
                    icon: BarChart3,
                    moduleSlug: 'inward-labour-cost-report',
                },
                {
                    title: 'sidebar.outwardLabourCostReport',
                    url: `/staff/${millId}/labour/outward/report`,
                    icon: BarChart3,
                    moduleSlug: 'outward-labour-cost-report',
                },
                {
                    title: 'sidebar.millingLabourCostReport',
                    url: `/staff/${millId}/labour/milling/report`,
                    icon: BarChart3,
                    moduleSlug: 'milling-labour-cost-report',
                },
                {
                    title: 'sidebar.otherLabourCostReport',
                    url: `/staff/${millId}/labour/other/report`,
                    icon: BarChart3,
                    moduleSlug: 'other-labour-cost-report',
                },
            ],
        },
        {
            title: 'sidebar.financialTransactionReports',
            items: [
                {
                    title: 'sidebar.financialReceiptReport',
                    url: `/staff/${millId}/financial/transaction/receipt/report`,
                    icon: FileBarChart,
                    moduleSlug: 'financial-receipt-report',
                },
                {
                    title: 'sidebar.financialPaymentReport',
                    url: `/staff/${millId}/financial/transaction/payment/report`,
                    icon: FileBarChart,
                    moduleSlug: 'financial-payment-report',
                },
            ],
        },
        {
            title: 'sidebar.other',
            items: [
                {
                    title: 'sidebar.settings',
                    icon: Settings,
                    items: [
                        {
                            title: 'sidebar.profile',
                            url: `/staff/${millId}/profile`,
                            icon: UserCog,
                        },
                        {
                            title: 'sidebar.appearance',
                            url: `/staff/${millId}/settings/appearance`,
                            icon: Palette,
                        },
                    ],
                },
                // {
                //     title: 'Help',
                //     url: `/staff/${millId}/help`,
                //     icon: HelpCircle,
                // },
            ],
        },
    ],
    profileLinks: [
        {
            title: 'sidebar.myProfile',
            url: `/staff/${millId}/profile`,
            icon: UserCog,
        },
        {
            title: 'sidebar.appearance',
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
