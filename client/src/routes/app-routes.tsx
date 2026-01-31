import { lazy, Suspense } from 'react'
// Auth routes
import { ForgotPassword } from '@/pages/auth/forgot-password'
import { SignIn } from '@/pages/auth/sign-in'
import { SignUp } from '@/pages/auth/sign-up'
// Error routes
import { NotFoundError } from '@/pages/errors/not-found-error'
// Eager load - Landing
import { Landing } from '@/pages/landing'
// Eager load - Super Admin Dashboard (existing)
import { Dashboard } from '@/pages/super-admin/dashboard'
import { Mills } from '@/pages/super-admin/mills'
// Error Boundary
import { ErrorBoundary } from '@/routes/error-boundary'
import { RootLayout } from '@/routes/root-layout'
import { createBrowserRouter } from 'react-router'
import { ComingSoon } from '@/components/coming-soon'
// Layouts
import { MillAdminLayout } from '@/components/layout/mill-admin-layout'
import { MillStaffLayout } from '@/components/layout/mill-staff-layout'
import { SuperAdminLayout } from '@/components/layout/super-admin-layout'
import { LoadingSpinner } from '@/components/loading-spinner'
import Error401Page from './errors/401'
import Error403Page from './errors/403'
import NotFoundPage from './errors/404'
import Error500Page from './errors/500'
import Error503Page from './errors/503'

// Lazy load - Super Admin
const Users = lazy(() =>
    import('@/pages/super-admin/users').then((m) => ({ default: m.Users }))
)
const Subscriptions = lazy(() =>
    import('@/pages/super-admin/subscriptions').then((m) => ({
        default: m.Subscriptions,
    }))
)
const SettingsProfile = lazy(() =>
    import('@/pages/super-admin/settings/profile').then((m) => ({
        default: m.SettingsProfile,
    }))
)
const SettingsAppearance = lazy(() =>
    import('@/pages/super-admin/settings/appearance').then((m) => ({
        default: m.SettingsAppearance,
    }))
)

// Lazy load - Mill Admin
const MillAdminDashboard = lazy(() =>
    import('@/pages/mill-admin/dashboard').then((m) => ({
        default: m.MillAdminDashboard,
    }))
)
const MillAdminStaff = lazy(() =>
    import('@/pages/mill-admin/staff').then((m) => ({
        default: m.MillAdminStaff,
    }))
)

const MillAdminProfile = lazy(() =>
    import('@/pages/mill-admin/settings/profile').then((m) => ({
        default: m.MillAdminProfile,
    }))
)
const MillAdminAppearance = lazy(() =>
    import('@/pages/mill-admin/settings/appearance').then((m) => ({
        default: m.MillAdminAppearance,
    }))
)

// Transaction Reports
const BrokerTransactionReport = lazy(() =>
    import('@/pages/mill-admin/transaction-reports/broker').then((m) => ({
        default: m.TransactionBrokerReport,
    }))
)
const PartyTransactionReport = lazy(() =>
    import('@/pages/mill-admin/transaction-reports/party').then((m) => ({
        default: m.TransactionPartyReport,
    }))
)

// Purchase Reports
const PaddyPurchaseReport = lazy(() =>
    import('@/pages/mill-admin/purchase-reports/paddy').then((m) => ({
        default: m.PaddyPurchaseReport,
    }))
)
const RicePurchaseReport = lazy(() =>
    import('@/pages/mill-admin/purchase-reports/rice').then((m) => ({
        default: m.RicePurchaseReport,
    }))
)
const GunnyPurchaseReport = lazy(() =>
    import('@/pages/mill-admin/purchase-reports/gunny').then((m) => ({
        default: m.GunnyPurchaseReport,
    }))
)
const FrkPurchaseReport = lazy(() =>
    import('@/pages/mill-admin/purchase-reports/frk').then((m) => ({
        default: m.FrkPurchaseReport,
    }))
)
const OtherPurchaseReport = lazy(() =>
    import('@/pages/mill-admin/purchase-reports/other').then((m) => ({
        default: m.OtherPurchaseReport,
    }))
)

// Balance Lifting of Purchases Reports
const BalanceLiftingPurchasesPaddyReport = lazy(() =>
    import('@/pages/mill-admin/balance-lifting-reports/balance-lifting-purchases-paddy').then(
        (m) => ({
            default: m.BalanceLiftingPurchasesPaddyReport,
        })
    )
)
const BalanceLiftingPurchasesRiceReport = lazy(() =>
    import('@/pages/mill-admin/balance-lifting-reports/balance-lifting-purchases-rice').then(
        (m) => ({
            default: m.BalanceLiftingPurchasesRiceReport,
        })
    )
)
const BalanceLiftingPurchasesGunnyReport = lazy(() =>
    import('@/pages/mill-admin/balance-lifting-reports/balance-lifting-purchases-gunny').then(
        (m) => ({
            default: m.BalanceLiftingPurchasesGunnyReport,
        })
    )
)
const BalanceLiftingPurchasesFrkReport = lazy(() =>
    import('@/pages/mill-admin/balance-lifting-reports/balance-lifting-purchases-frk').then(
        (m) => ({
            default: m.BalanceLiftingPurchasesFrkReport,
        })
    )
)

// Balance Lifting of Sales Reports
const BalanceLiftingSalesPaddyReport = lazy(() =>
    import('@/pages/mill-admin/balance-lifting-reports/balance-lifting-sales-paddy').then(
        (m) => ({
            default: m.BalanceLiftingSalesPaddyReport,
        })
    )
)

// Outward Balance Lifting of Rice Sales Reports
const OutwardBalanceLiftingRiceReport = lazy(() =>
    import('@/pages/mill-admin/outward-balance-lifting-reports/outward-balance-lifting-rice').then(
        (m) => ({
            default: m.OutwardBalanceLiftingRiceReport,
        })
    )
)

// Sales Reports
const RiceSalesReport = lazy(() =>
    import('@/pages/mill-admin/sales-reports/rice-sales').then((m) => ({
        default: m.RiceSalesReport,
    }))
)
const PaddySalesReport = lazy(() =>
    import('@/pages/mill-admin/sales-reports/paddy-sales').then((m) => ({
        default: m.PaddySalesReport,
    }))
)
const GunnySalesReport = lazy(() =>
    import('@/pages/mill-admin/sales-reports/gunny-sales').then((m) => ({
        default: m.GunnySalesReport,
    }))
)
const KhandaSalesReport = lazy(() =>
    import('@/pages/mill-admin/sales-reports/khanda-sales').then((m) => ({
        default: m.KhandaSalesReport,
    }))
)
const NakkhiSalesReport = lazy(() =>
    import('@/pages/mill-admin/sales-reports/nakkhi-sales').then((m) => ({
        default: m.NakkhiSalesReport,
    }))
)
const OtherSalesReport = lazy(() =>
    import('@/pages/mill-admin/sales-reports/other-sales').then((m) => ({
        default: m.OtherSalesReport,
    }))
)
// const DoSalesReport = lazy(() =>
//     import('@/pages/mill-admin/sales-reports/do-sales').then((m) => ({
//         default: m.DoSalesReport,
//     }))
// )

// Inward Reports
const GovtPaddyInwardReport = lazy(() =>
    import('@/pages/mill-admin/inward-reports/govt-paddy-inward').then((m) => ({
        default: m.GovtPaddyInwardReport,
    }))
)
const PrivatePaddyInwardReport = lazy(() =>
    import('@/pages/mill-admin/inward-reports/private-paddy-inward').then(
        (m) => ({
            default: m.PrivatePaddyInwardReport,
        })
    )
)
const RiceInwardReport = lazy(() =>
    import('@/pages/mill-admin/inward-reports/rice-inward').then((m) => ({
        default: m.RiceInwardReport,
    }))
)
const GunnyInwardReport = lazy(() =>
    import('@/pages/mill-admin/inward-reports/gunny-inward').then((m) => ({
        default: m.GunnyInwardReport,
    }))
)
const OtherInwardReport = lazy(() =>
    import('@/pages/mill-admin/inward-reports/other-inward').then((m) => ({
        default: m.OtherInwardReport,
    }))
)
const FrkInwardReport = lazy(() =>
    import('@/pages/mill-admin/inward-reports/frk-inward').then((m) => ({
        default: m.FrkInwardReport,
    }))
)

// Outward Reports
const PrivatePaddyOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/private-paddy-outward').then(
        (m) => ({
            default: m.PrivatePaddyOutwardReport,
        })
    )
)
const PrivateRiceOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/private-rice-outward').then(
        (m) => ({
            default: m.PrivateRiceOutwardReport,
        })
    )
)
const GovtRiceOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/govt-rice-outward').then(
        (m) => ({
            default: m.GovtRiceOutwardReport,
        })
    )
)
const GovtGunnyOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/govt-gunny-outward').then(
        (m) => ({
            default: m.GovtGunnyOutwardReport,
        })
    )
)
const PrivateGunnyOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/private-gunny-outward').then(
        (m) => ({
            default: m.PrivateGunnyOutwardReport,
        })
    )
)
const FrkOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/frk-outward').then((m) => ({
        default: m.FrkOutwardReport,
    }))
)
const KhandaOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/khanda-outward').then((m) => ({
        default: m.KhandaOutwardReport,
    }))
)
const NakkhiOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/nakkhi-outward').then((m) => ({
        default: m.NakkhiOutwardReport,
    }))
)
const BhusaOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/bhusa-outward').then((m) => ({
        default: m.BhusaOutwardReport,
    }))
)
const KodhaOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/kodha-outward').then((m) => ({
        default: m.KodhaOutwardReport,
    }))
)
const SilkyKodhaOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/silky-kodha-outward').then(
        (m) => ({
            default: m.SilkyKodhaOutwardReport,
        })
    )
)
const OtherOutwardReport = lazy(() =>
    import('@/pages/mill-admin/outward-reports/other-outward').then((m) => ({
        default: m.OtherOutwardReport,
    }))
)

// Milling Reports -
const MillingPaddyReport = lazy(() =>
    import('@/pages/mill-admin/milling-reports/milling-paddy').then((m) => ({
        default: m.MillingPaddyReport,
    }))
)
const MillingRiceReport = lazy(() =>
    import('@/pages/mill-admin/milling-reports/milling-rice').then((m) => ({
        default: m.MillingRiceReport,
    }))
)

// Labour Cost Reports -
const LabourInwardReport = lazy(() =>
    import('@/pages/mill-admin/labour-cost-reports/labour-inward').then(
        (m) => ({
            default: m.LabourInwardReport,
        })
    )
)
const LabourOutwardReport = lazy(() =>
    import('@/pages/mill-admin/labour-cost-reports/labour-outward').then(
        (m) => ({
            default: m.LabourOutwardReport,
        })
    )
)
const LabourMillingReport = lazy(() =>
    import('@/pages/mill-admin/labour-cost-reports/labour-milling').then(
        (m) => ({
            default: m.LabourMillingReport,
        })
    )
)
const LabourOtherReport = lazy(() =>
    import('@/pages/mill-admin/labour-cost-reports/labour-other').then((m) => ({
        default: m.LabourOtherReport,
    }))
)

// Financial Transaction Reports -
const FinancialReceiptReport = lazy(() =>
    import('@/pages/mill-admin/financial-transaction-reports/financial-receipt').then(
        (m) => ({
            default: m.FinancialReceiptReport,
        })
    )
)
const FinancialPaymentReport = lazy(() =>
    import('@/pages/mill-admin/financial-transaction-reports/financial-payment').then(
        (m) => ({
            default: m.FinancialPaymentReport,
        })
    )
)

// Stock
const StockOverviewReport = lazy(() =>
    import('@/pages/mill-admin/stock/stock-overview').then((m) => ({
        default: m.StockOverviewReport,
    }))
)

// Daily Reports
const PurchaseDealsReport = lazy(() =>
    import('@/pages/mill-admin/daily-reports/purchase-deals').then((m) => ({
        default: m.PurchaseDealsReport,
    }))
)

const SalesDealsReport = lazy(() =>
    import('@/pages/mill-admin/daily-reports/sales-deals').then((m) => ({
        default: m.SalesDealsReport,
    }))
)

const InwardsReport = lazy(() =>
    import('@/pages/mill-admin/daily-reports/inwards').then((m) => ({
        default: m.InwardsReport,
    }))
)

const OutwardsReport = lazy(() =>
    import('@/pages/mill-admin/daily-reports/outwards').then((m) => ({
        default: m.OutwardsReport,
    }))
)

const MillingReport = lazy(() =>
    import('@/pages/mill-admin/daily-reports/milling').then((m) => ({
        default: m.MillingReport,
    }))
)

const ProductionReport = lazy(() =>
    import('@/pages/mill-admin/daily-reports/production').then((m) => ({
        default: m.ProductionReport,
    }))
)

const ReceiptReport = lazy(() =>
    import('@/pages/mill-admin/daily-reports/receipt').then((m) => ({
        default: m.ReceiptReport,
    }))
)

const PaymentReport = lazy(() =>
    import('@/pages/mill-admin/daily-reports/payment').then((m) => ({
        default: m.PaymentReport,
    }))
)

// Lazy load - Mill Staff
const MillStaffDashboard = lazy(() =>
    import('@/pages/mill-staff').then((m) => ({
        default: m.MillStaffDashboard,
    }))
)

const MillStaffProfile = lazy(() =>
    import('@/pages/mill-staff/settings/profile').then((m) => ({
        default: m.MillStaffProfile,
    }))
)

const MillStaffAppearance = lazy(() =>
    import('@/pages/mill-staff/settings/appearance').then((m) => ({
        default: m.MillStaffAppearance,
    }))
)

const MillStaffStaff = lazy(() =>
    import('@/pages/mill-staff/staff').then((m) => ({
        default: m.MillStaffStaff,
    }))
)

// Mill Staff Purchase Reports
const MillStaffPaddyPurchaseReport = lazy(() =>
    import('@/pages/mill-staff/purchase-reports/paddy').then((m) => ({
        default: m.PaddyPurchaseReport,
    }))
)
const MillStaffRicePurchaseReport = lazy(() =>
    import('@/pages/mill-staff/purchase-reports/rice').then((m) => ({
        default: m.RicePurchaseReport,
    }))
)
const MillStaffGunnyPurchaseReport = lazy(() =>
    import('@/pages/mill-staff/purchase-reports/gunny').then((m) => ({
        default: m.GunnyPurchaseReport,
    }))
)
const MillStaffFrkPurchaseReport = lazy(() =>
    import('@/pages/mill-staff/purchase-reports/frk').then((m) => ({
        default: m.FrkPurchaseReport,
    }))
)
const MillStaffOtherPurchaseReport = lazy(() =>
    import('@/pages/mill-staff/purchase-reports/other').then((m) => ({
        default: m.OtherPurchaseReport,
    }))
)

// Mill Staff Sales Reports
const MillStaffRiceSalesReport = lazy(() =>
    import('@/pages/mill-staff/sales-reports/rice-sales').then((m) => ({
        default: m.RiceSalesReport,
    }))
)
const MillStaffPaddySalesReport = lazy(() =>
    import('@/pages/mill-staff/sales-reports/paddy-sales').then((m) => ({
        default: m.PaddySalesReport,
    }))
)
const MillStaffGunnySalesReport = lazy(() =>
    import('@/pages/mill-staff/sales-reports/gunny-sales').then((m) => ({
        default: m.GunnySalesReport,
    }))
)
const MillStaffKhandaSalesReport = lazy(() =>
    import('@/pages/mill-staff/sales-reports/khanda-sales').then((m) => ({
        default: m.KhandaSalesReport,
    }))
)
const MillStaffNakkhiSalesReport = lazy(() =>
    import('@/pages/mill-staff/sales-reports/nakkhi-sales').then((m) => ({
        default: m.NakkhiSalesReport,
    }))
)
const MillStaffOtherSalesReport = lazy(() =>
    import('@/pages/mill-staff/sales-reports/other-sales').then((m) => ({
        default: m.OtherSalesReport,
    }))
)

// Mill Staff Input Reports
const PartyReport = lazy(() =>
    import('@/pages/mill-staff/input-reports/party-report').then((m) => ({
        default: m.PartyReport,
    }))
)
const TransporterReport = lazy(() =>
    import('@/pages/mill-staff/input-reports/transporter-report').then((m) => ({
        default: m.TransporterReport,
    }))
)
const BrokerReport = lazy(() =>
    import('@/pages/mill-staff/input-reports/broker-report').then((m) => ({
        default: m.BrokerReport,
    }))
)
const CommitteeReport = lazy(() =>
    import('@/pages/mill-staff/input-reports/committee-report').then((m) => ({
        default: m.CommitteeReport,
    }))
)
const DoReport = lazy(() =>
    import('@/pages/mill-staff/input-reports/do-report').then((m) => ({
        default: m.DoReport,
    }))
)
const VehicleReport = lazy(() =>
    import('@/pages/mill-staff/input-reports/vehicle-report').then((m) => ({
        default: m.VehicleReport,
    }))
)
const StaffReport = lazy(() =>
    import('@/pages/mill-staff/input-reports/staff-report').then((m) => ({
        default: m.StaffReport,
    }))
)
const LabourGroupReport = lazy(() =>
    import('@/pages/mill-staff/input-reports/labour-group-report').then(
        (m) => ({
            default: m.LabourGroupReport,
        })
    )
)

// Mill Staff Transaction Reports
const MillStaffBrokerTransactionReport = lazy(() =>
    import('@/pages/mill-staff/transaction-reports/broker').then((m) => ({
        default: m.TransactionBrokerReport,
    }))
)
const MillStaffPartyTransactionReport = lazy(() =>
    import('@/pages/mill-staff/transaction-reports/party').then((m) => ({
        default: m.TransactionPartyReport,
    }))
)

// Mill Staff Balance Lifting Reports
const MillStaffBalanceLiftingPurchasesPaddyReport = lazy(() =>
    import('@/pages/mill-staff/balance-lifting-reports/balance-lifting-purchases-paddy').then(
        (m) => ({
            default: m.BalanceLiftingPurchasesPaddyReport,
        })
    )
)
const MillStaffBalanceLiftingPurchasesRiceReport = lazy(() =>
    import('@/pages/mill-staff/balance-lifting-reports/balance-lifting-purchases-rice').then(
        (m) => ({
            default: m.BalanceLiftingPurchasesRiceReport,
        })
    )
)
const MillStaffBalanceLiftingPurchasesGunnyReport = lazy(() =>
    import('@/pages/mill-staff/balance-lifting-reports/balance-lifting-purchases-gunny').then(
        (m) => ({
            default: m.BalanceLiftingPurchasesGunnyReport,
        })
    )
)
const MillStaffBalanceLiftingPurchasesFrkReport = lazy(() =>
    import('@/pages/mill-staff/balance-lifting-reports/balance-lifting-purchases-frk').then(
        (m) => ({
            default: m.BalanceLiftingPurchasesFrkReport,
        })
    )
)
const MillStaffBalanceLiftingSalesPaddyReport = lazy(() =>
    import('@/pages/mill-staff/balance-lifting-reports/balance-lifting-sales-paddy').then(
        (m) => ({
            default: m.BalanceLiftingSalesPaddyReport,
        })
    )
)
const MillStaffOutwardBalanceLiftingRiceReport = lazy(() =>
    import('@/pages/mill-staff/outward-balance-lifting-reports/outward-balance-lifting-rice').then(
        (m) => ({
            default: m.OutwardBalanceLiftingRiceReport,
        })
    )
)

// Mill Staff Inward Reports
const MillStaffGovtPaddyInwardReport = lazy(() =>
    import('@/pages/mill-staff/inward-reports/govt-paddy-inward').then((m) => ({
        default: m.GovtPaddyInwardReport,
    }))
)
const MillStaffPrivatePaddyInwardReport = lazy(() =>
    import('@/pages/mill-staff/inward-reports/private-paddy-inward').then(
        (m) => ({
            default: m.PrivatePaddyInwardReport,
        })
    )
)
const MillStaffRiceInwardReport = lazy(() =>
    import('@/pages/mill-staff/inward-reports/rice-inward').then((m) => ({
        default: m.RiceInwardReport,
    }))
)
const MillStaffGunnyInwardReport = lazy(() =>
    import('@/pages/mill-staff/inward-reports/gunny-inward').then((m) => ({
        default: m.GunnyInwardReport,
    }))
)
const MillStaffOtherInwardReport = lazy(() =>
    import('@/pages/mill-staff/inward-reports/other-inward').then((m) => ({
        default: m.OtherInwardReport,
    }))
)
const MillStaffFrkInwardReport = lazy(() =>
    import('@/pages/mill-staff/inward-reports/frk-inward').then((m) => ({
        default: m.FrkInwardReport,
    }))
)

// Mill Staff Outward Reports
const MillStaffPrivatePaddyOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/private-paddy-outward').then(
        (m) => ({
            default: m.PrivatePaddyOutwardReport,
        })
    )
)
const MillStaffPrivateRiceOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/private-rice-outward').then(
        (m) => ({
            default: m.PrivateRiceOutwardReport,
        })
    )
)
const MillStaffGovtRiceOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/govt-rice-outward').then(
        (m) => ({
            default: m.GovtRiceOutwardReport,
        })
    )
)
const MillStaffGovtGunnyOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/govt-gunny-outward').then(
        (m) => ({
            default: m.GovtGunnyOutwardReport,
        })
    )
)
const MillStaffPrivateGunnyOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/private-gunny-outward').then(
        (m) => ({
            default: m.PrivateGunnyOutwardReport,
        })
    )
)
const MillStaffFrkOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/frk-outward').then((m) => ({
        default: m.FrkOutwardReport,
    }))
)
const MillStaffKhandaOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/khanda-outward').then((m) => ({
        default: m.KhandaOutwardReport,
    }))
)
const MillStaffNakkhiOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/nakkhi-outward').then((m) => ({
        default: m.NakkhiOutwardReport,
    }))
)
const MillStaffBhusaOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/bhusa-outward').then((m) => ({
        default: m.BhusaOutwardReport,
    }))
)
const MillStaffKodhaOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/kodha-outward').then((m) => ({
        default: m.KodhaOutwardReport,
    }))
)
const MillStaffSilkyKodhaOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/silky-kodha-outward').then(
        (m) => ({
            default: m.SilkyKodhaOutwardReport,
        })
    )
)
const MillStaffOtherOutwardReport = lazy(() =>
    import('@/pages/mill-staff/outward-reports/other-outward').then((m) => ({
        default: m.OtherOutwardReport,
    }))
)

// Mill Staff Milling Reports
const MillStaffMillingPaddyReport = lazy(() =>
    import('@/pages/mill-staff/milling-reports/milling-paddy').then((m) => ({
        default: m.MillingPaddyReport,
    }))
)
const MillStaffMillingRiceReport = lazy(() =>
    import('@/pages/mill-staff/milling-reports/milling-rice').then((m) => ({
        default: m.MillingRiceReport,
    }))
)

// Mill Staff Labour Cost Reports
const MillStaffLabourInwardReport = lazy(() =>
    import('@/pages/mill-staff/labour-cost-reports/labour-inward').then(
        (m) => ({
            default: m.LabourInwardReport,
        })
    )
)
const MillStaffLabourOutwardReport = lazy(() =>
    import('@/pages/mill-staff/labour-cost-reports/labour-outward').then(
        (m) => ({
            default: m.LabourOutwardReport,
        })
    )
)
const MillStaffLabourMillingReport = lazy(() =>
    import('@/pages/mill-staff/labour-cost-reports/labour-milling').then(
        (m) => ({
            default: m.LabourMillingReport,
        })
    )
)
const MillStaffLabourOtherReport = lazy(() =>
    import('@/pages/mill-staff/labour-cost-reports/labour-other').then((m) => ({
        default: m.LabourOtherReport,
    }))
)

// Mill Staff Financial Transaction Reports
const MillStaffFinancialReceiptReport = lazy(() =>
    import('@/pages/mill-staff/financial-transaction-reports/financial-receipt').then(
        (m) => ({
            default: m.FinancialReceiptReport,
        })
    )
)
const MillStaffFinancialPaymentReport = lazy(() =>
    import('@/pages/mill-staff/financial-transaction-reports/financial-payment').then(
        (m) => ({
            default: m.FinancialPaymentReport,
        })
    )
)

// Mill Staff Stock Reports
const MillStaffStockOverviewReport = lazy(() =>
    import('@/pages/mill-staff/stock/stock-overview').then((m) => ({
        default: m.StockOverviewReport,
    }))
)

// Mill Staff Daily Reports
const MillStaffPurchaseDealsReport = lazy(() =>
    import('@/pages/mill-staff/daily-reports/purchase-deals').then((m) => ({
        default: m.PurchaseDealsReport,
    }))
)
const MillStaffSalesDealsReport = lazy(() =>
    import('@/pages/mill-staff/daily-reports/sales-deals').then((m) => ({
        default: m.SalesDealsReport,
    }))
)
const MillStaffInwardsReport = lazy(() =>
    import('@/pages/mill-staff/daily-reports/inwards').then((m) => ({
        default: m.InwardsReport,
    }))
)
const MillStaffOutwardsReport = lazy(() =>
    import('@/pages/mill-staff/daily-reports/outwards').then((m) => ({
        default: m.OutwardsReport,
    }))
)
const MillStaffMillingReport = lazy(() =>
    import('@/pages/mill-staff/daily-reports/milling').then((m) => ({
        default: m.MillingReport,
    }))
)
const MillStaffProductionReport = lazy(() =>
    import('@/pages/mill-staff/daily-reports/production').then((m) => ({
        default: m.ProductionReport,
    }))
)
const MillStaffReceiptReport = lazy(() =>
    import('@/pages/mill-staff/daily-reports/receipt').then((m) => ({
        default: m.ReceiptReport,
    }))
)
const MillStaffPaymentReport = lazy(() =>
    import('@/pages/mill-staff/daily-reports/payment').then((m) => ({
        default: m.PaymentReport,
    }))
)

// Daily Reports Overview
const MillStaffDailyReportsOverview = lazy(() =>
    import('@/pages/mill-staff/daily-reports').then((m) => ({
        default: m.DailyReportsOverview,
    }))
)

// Root layout with Suspense wrapper for navigation
function RootLayoutWithSuspense() {
    return (
        <Suspense fallback={<LoadingSpinner className='h-screen w-screen' />}>
            <RootLayout />
        </Suspense>
    )
}

// Wrapper for lazy components with Suspense
function LazyRoute({ Component }: { Component: React.ComponentType }) {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Component />
        </Suspense>
    )
}

// Declarative route configuration with data router support
export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayoutWithSuspense />,
        errorElement: <ErrorBoundary />,
        children: [
            // ==========================================
            // Public Routes
            // ==========================================
            {
                index: true,
                element: <Landing />,
            },

            // ==========================================
            // Super Admin Routes (/admin/*)
            // ==========================================
            {
                path: 'admin',
                element: <SuperAdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                    {
                        path: 'mills',
                        element: <Mills />,
                    },
                    {
                        path: 'users',
                        element: <LazyRoute Component={Users} />,
                    },
                    {
                        path: 'settings',
                        element: <LazyRoute Component={SettingsProfile} />,
                    },
                    {
                        path: 'settings/appearance',
                        element: <LazyRoute Component={SettingsAppearance} />,
                    },
                    {
                        path: 'subscriptions',
                        element: <LazyRoute Component={Subscriptions} />,
                    },
                    {
                        path: 'help-center',
                        element: <LazyRoute Component={ComingSoon} />,
                    },
                ],
            },

            // ==========================================
            // Mill Admin Routes (/mill/:millId/*)
            // ==========================================
            {
                path: 'mill/:millId',
                element: <MillAdminLayout />,
                children: [
                    {
                        index: true,
                        element: <LazyRoute Component={MillAdminDashboard} />,
                    },
                    {
                        path: 'staff',
                        element: <LazyRoute Component={MillAdminStaff} />,
                    },
                    {
                        path: 'settings',
                        element: <LazyRoute Component={MillAdminProfile} />,
                    },
                    {
                        path: 'settings/appearance',
                        element: <LazyRoute Component={MillAdminAppearance} />,
                    },
                    {
                        path: 'transaction/broker',
                        element: (
                            <LazyRoute Component={BrokerTransactionReport} />
                        ),
                    },
                    {
                        path: 'transaction/party',
                        element: (
                            <LazyRoute Component={PartyTransactionReport} />
                        ),
                    },
                    {
                        path: 'purchases/paddy/report',
                        element: <LazyRoute Component={PaddyPurchaseReport} />,
                    },
                    {
                        path: 'purchases/rice/report',
                        element: <LazyRoute Component={RicePurchaseReport} />,
                    },
                    {
                        path: 'purchases/gunny/report',
                        element: <LazyRoute Component={GunnyPurchaseReport} />,
                    },
                    {
                        path: 'purchases/frk/report',
                        element: <LazyRoute Component={FrkPurchaseReport} />,
                    },
                    {
                        path: 'purchases/other/report',
                        element: <LazyRoute Component={OtherPurchaseReport} />,
                    },
                    {
                        path: 'balance/lifting/report/purchases/paddy',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingPurchasesPaddyReport}
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/rice',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingPurchasesRiceReport}
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/gunny',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingPurchasesGunnyReport}
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/frk',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingPurchasesFrkReport}
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/sales/paddy',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingSalesPaddyReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/balance/lifting/report/rice',
                        element: (
                            <LazyRoute
                                Component={OutwardBalanceLiftingRiceReport}
                            />
                        ),
                    },
                    {
                        path: 'sales/rice/report',
                        element: <LazyRoute Component={RiceSalesReport} />,
                    },
                    {
                        path: 'sales/paddy/report',
                        element: <LazyRoute Component={PaddySalesReport} />,
                    },
                    {
                        path: 'sales/gunny/report',
                        element: <LazyRoute Component={GunnySalesReport} />,
                    },
                    {
                        path: 'sales/khanda/report',
                        element: <LazyRoute Component={KhandaSalesReport} />,
                    },
                    {
                        path: 'sales/nakkhi/report',
                        element: <LazyRoute Component={NakkhiSalesReport} />,
                    },
                    {
                        path: 'sales/other/report',
                        element: <LazyRoute Component={OtherSalesReport} />,
                    },
                    // {
                    //     path: 'sales/do/report',
                    //     element: <LazyRoute Component={DoSalesReport} />,
                    // },
                    {
                        path: 'inward/govt/paddy/report',
                        element: (
                            <LazyRoute Component={GovtPaddyInwardReport} />
                        ),
                    },
                    {
                        path: 'inward/private/paddy/report',
                        element: (
                            <LazyRoute Component={PrivatePaddyInwardReport} />
                        ),
                    },
                    {
                        path: 'inward/rice/report',
                        element: <LazyRoute Component={RiceInwardReport} />,
                    },
                    {
                        path: 'inward/gunny/report',
                        element: <LazyRoute Component={GunnyInwardReport} />,
                    },
                    {
                        path: 'inward/other/report',
                        element: <LazyRoute Component={OtherInwardReport} />,
                    },
                    {
                        path: 'inward/frk/report',
                        element: <LazyRoute Component={FrkInwardReport} />,
                    },
                    {
                        path: 'inward/other/report',
                        element: <LazyRoute Component={OtherInwardReport} />,
                    },
                    {
                        path: 'outward/private/paddy/report',
                        element: (
                            <LazyRoute Component={PrivatePaddyOutwardReport} />
                        ),
                    },
                    {
                        path: 'outward/private/rice/report',
                        element: (
                            <LazyRoute Component={PrivateRiceOutwardReport} />
                        ),
                    },
                    {
                        path: 'outward/govt/rice/report',
                        element: (
                            <LazyRoute Component={GovtRiceOutwardReport} />
                        ),
                    },
                    {
                        path: 'outward/govt/gunny/report',
                        element: (
                            <LazyRoute Component={GovtGunnyOutwardReport} />
                        ),
                    },
                    {
                        path: 'outward/private/gunny/report',
                        element: (
                            <LazyRoute Component={PrivateGunnyOutwardReport} />
                        ),
                    },
                    {
                        path: 'outward/frk/report',
                        element: <LazyRoute Component={FrkOutwardReport} />,
                    },
                    {
                        path: 'outward/khanda/report',
                        element: <LazyRoute Component={KhandaOutwardReport} />,
                    },
                    {
                        path: 'outward/nakkhi/report',
                        element: <LazyRoute Component={NakkhiOutwardReport} />,
                    },
                    {
                        path: 'outward/bhusa/report',
                        element: <LazyRoute Component={BhusaOutwardReport} />,
                    },
                    {
                        path: 'outward/kodha/report',
                        element: <LazyRoute Component={KodhaOutwardReport} />,
                    },
                    {
                        path: 'outward/silky-kodha/report',
                        element: (
                            <LazyRoute Component={SilkyKodhaOutwardReport} />
                        ),
                    },
                    {
                        path: 'outward/other/report',
                        element: <LazyRoute Component={OtherOutwardReport} />,
                    },
                    {
                        path: 'milling/paddy/report',
                        element: <LazyRoute Component={MillingPaddyReport} />,
                    },
                    {
                        path: 'milling/rice/report',
                        element: <LazyRoute Component={MillingRiceReport} />,
                    },
                    {
                        path: 'labour/inward/report',
                        element: <LazyRoute Component={LabourInwardReport} />,
                    },
                    {
                        path: 'labour/outward/report',
                        element: <LazyRoute Component={LabourOutwardReport} />,
                    },
                    {
                        path: 'labour/milling/report',
                        element: <LazyRoute Component={LabourMillingReport} />,
                    },
                    {
                        path: 'labour/other/report',
                        element: <LazyRoute Component={LabourOtherReport} />,
                    },
                    {
                        path: 'financial/transaction/receipt/report',
                        element: (
                            <LazyRoute Component={FinancialReceiptReport} />
                        ),
                    },
                    {
                        path: 'financial/transaction/payment/report',
                        element: (
                            <LazyRoute Component={FinancialPaymentReport} />
                        ),
                    },
                    {
                        path: 'stock/overview/report',
                        element: <LazyRoute Component={StockOverviewReport} />,
                    },
                    {
                        path: 'daily/reports',
                        element: (
                            <LazyRoute
                                Component={MillStaffDailyReportsOverview}
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/purchase',
                        element: <LazyRoute Component={PurchaseDealsReport} />,
                    },
                    {
                        path: 'daily/reports/sales',
                        element: <LazyRoute Component={SalesDealsReport} />,
                    },
                    {
                        path: 'daily/reports/inwards',
                        element: <LazyRoute Component={InwardsReport} />,
                    },
                    {
                        path: 'daily/reports/outwards',
                        element: <LazyRoute Component={OutwardsReport} />,
                    },
                    {
                        path: 'daily/reports/milling',
                        element: <LazyRoute Component={MillingReport} />,
                    },
                    {
                        path: 'daily/reports/production',
                        element: <LazyRoute Component={ProductionReport} />,
                    },
                    {
                        path: 'daily/reports/receipt',
                        element: <LazyRoute Component={ReceiptReport} />,
                    },
                    {
                        path: 'daily/reports/payment',
                        element: <LazyRoute Component={PaymentReport} />,
                    },
                    {
                        path: 'input/reports/party',
                        element: <LazyRoute Component={PartyReport} />,
                    },
                    {
                        path: 'input/reports/transporter',
                        element: <LazyRoute Component={TransporterReport} />,
                    },
                    {
                        path: 'input/reports/broker',
                        element: <LazyRoute Component={BrokerReport} />,
                    },
                    {
                        path: 'input/reports/committee',
                        element: <LazyRoute Component={CommitteeReport} />,
                    },
                    {
                        path: 'input/reports/do',
                        element: <LazyRoute Component={DoReport} />,
                    },
                    {
                        path: 'input/reports/vehicle',
                        element: <LazyRoute Component={VehicleReport} />,
                    },
                    {
                        path: 'input/reports/staff',
                        element: <LazyRoute Component={StaffReport} />,
                    },
                    {
                        path: 'input/reports/labour-group',
                        element: <LazyRoute Component={LabourGroupReport} />,
                    },
                ],
            },

            // ==========================================
            // Mill Staff Routes (/staff/:millId/:staffId/*)
            // ==========================================
            {
                path: 'staff/:millId/:staffId',
                element: <MillStaffLayout />,
                children: [
                    {
                        index: true,
                        element: <LazyRoute Component={MillStaffDashboard} />,
                    },
                    {
                        path: 'settings',
                        element: <LazyRoute Component={MillStaffProfile} />,
                    },
                    {
                        path: 'settings/appearance',
                        element: <LazyRoute Component={MillStaffAppearance} />,
                    },
                    {
                        path: 'profile',
                        element: <LazyRoute Component={MillStaffProfile} />,
                    },
                    {
                        path: 'manage/staff',
                        element: <LazyRoute Component={MillStaffStaff} />,
                    },
                    {
                        path: 'transaction/broker',
                        element: (
                            <LazyRoute
                                Component={MillStaffBrokerTransactionReport}
                            />
                        ),
                    },
                    {
                        path: 'transaction/party',
                        element: (
                            <LazyRoute
                                Component={MillStaffPartyTransactionReport}
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/paddy',
                        element: (
                            <LazyRoute
                                Component={
                                    MillStaffBalanceLiftingPurchasesPaddyReport
                                }
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/rice',
                        element: (
                            <LazyRoute
                                Component={
                                    MillStaffBalanceLiftingPurchasesRiceReport
                                }
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/gunny',
                        element: (
                            <LazyRoute
                                Component={
                                    MillStaffBalanceLiftingPurchasesGunnyReport
                                }
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/frk',
                        element: (
                            <LazyRoute
                                Component={
                                    MillStaffBalanceLiftingPurchasesFrkReport
                                }
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/sales/paddy',
                        element: (
                            <LazyRoute
                                Component={
                                    MillStaffBalanceLiftingSalesPaddyReport
                                }
                            />
                        ),
                    },
                    {
                        path: 'outward/balance/lifting/report/rice',
                        element: (
                            <LazyRoute
                                Component={
                                    MillStaffOutwardBalanceLiftingRiceReport
                                }
                            />
                        ),
                    },
                    {
                        path: 'inward/govt/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGovtPaddyInwardReport}
                            />
                        ),
                    },
                    {
                        path: 'inward/private/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPrivatePaddyInwardReport}
                            />
                        ),
                    },
                    {
                        path: 'inward/rice/report',
                        element: (
                            <LazyRoute Component={MillStaffRiceInwardReport} />
                        ),
                    },
                    {
                        path: 'inward/gunny/report',
                        element: (
                            <LazyRoute Component={MillStaffGunnyInwardReport} />
                        ),
                    },
                    {
                        path: 'inward/other/report',
                        element: (
                            <LazyRoute Component={MillStaffOtherInwardReport} />
                        ),
                    },
                    {
                        path: 'inward/frk/report',
                        element: (
                            <LazyRoute Component={MillStaffFrkInwardReport} />
                        ),
                    },
                    {
                        path: 'outward/private/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPrivatePaddyOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/private/rice/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPrivateRiceOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/govt/rice/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGovtRiceOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/govt/gunny/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGovtGunnyOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/private/gunny/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPrivateGunnyOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/frk/report',
                        element: (
                            <LazyRoute Component={MillStaffFrkOutwardReport} />
                        ),
                    },
                    {
                        path: 'outward/khanda/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffKhandaOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/nakkhi/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffNakkhiOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/bhusa/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffBhusaOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/kodha/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffKodhaOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/silky-kodha/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffSilkyKodhaOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'outward/other/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffOtherOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'milling/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffMillingPaddyReport}
                            />
                        ),
                    },
                    {
                        path: 'milling/rice/report',
                        element: (
                            <LazyRoute Component={MillStaffMillingRiceReport} />
                        ),
                    },
                    {
                        path: 'labour/inward/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffLabourInwardReport}
                            />
                        ),
                    },
                    {
                        path: 'labour/outward/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffLabourOutwardReport}
                            />
                        ),
                    },
                    {
                        path: 'labour/milling/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffLabourMillingReport}
                            />
                        ),
                    },
                    {
                        path: 'labour/other/report',
                        element: (
                            <LazyRoute Component={MillStaffLabourOtherReport} />
                        ),
                    },
                    {
                        path: 'financial/transaction/receipt/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffFinancialReceiptReport}
                            />
                        ),
                    },
                    {
                        path: 'financial/transaction/payment/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffFinancialPaymentReport}
                            />
                        ),
                    },
                    {
                        path: 'stock/overview/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffStockOverviewReport}
                            />
                        ),
                    },
                    {
                        path: 'daily/reports',
                        element: (
                            <LazyRoute
                                Component={MillStaffDailyReportsOverview}
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/purchase',
                        element: (
                            <LazyRoute
                                Component={MillStaffPurchaseDealsReport}
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/sales',
                        element: (
                            <LazyRoute Component={MillStaffSalesDealsReport} />
                        ),
                    },
                    {
                        path: 'daily/reports/inwards',
                        element: (
                            <LazyRoute Component={MillStaffInwardsReport} />
                        ),
                    },
                    {
                        path: 'daily/reports/outwards',
                        element: (
                            <LazyRoute Component={MillStaffOutwardsReport} />
                        ),
                    },
                    {
                        path: 'daily/reports/milling',
                        element: (
                            <LazyRoute Component={MillStaffMillingReport} />
                        ),
                    },
                    {
                        path: 'daily/reports/production',
                        element: (
                            <LazyRoute Component={MillStaffProductionReport} />
                        ),
                    },
                    {
                        path: 'daily/reports/receipt',
                        element: (
                            <LazyRoute Component={MillStaffReceiptReport} />
                        ),
                    },
                    {
                        path: 'daily/reports/payment',
                        element: (
                            <LazyRoute Component={MillStaffPaymentReport} />
                        ),
                    },
                    {
                        path: 'purchases/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPaddyPurchaseReport}
                            />
                        ),
                    },
                    {
                        path: 'purchases/rice/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffRicePurchaseReport}
                            />
                        ),
                    },
                    {
                        path: 'purchases/gunny/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGunnyPurchaseReport}
                            />
                        ),
                    },
                    {
                        path: 'purchases/frk/report',
                        element: (
                            <LazyRoute Component={MillStaffFrkPurchaseReport} />
                        ),
                    },
                    {
                        path: 'purchases/other/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffOtherPurchaseReport}
                            />
                        ),
                    },
                    {
                        path: 'sales/rice/report',
                        element: (
                            <LazyRoute Component={MillStaffRiceSalesReport} />
                        ),
                    },
                    {
                        path: 'sales/paddy/report',
                        element: (
                            <LazyRoute Component={MillStaffPaddySalesReport} />
                        ),
                    },
                    {
                        path: 'sales/gunny/report',
                        element: (
                            <LazyRoute Component={MillStaffGunnySalesReport} />
                        ),
                    },
                    {
                        path: 'sales/khanda/report',
                        element: (
                            <LazyRoute Component={MillStaffKhandaSalesReport} />
                        ),
                    },
                    {
                        path: 'sales/nakkhi/report',
                        element: (
                            <LazyRoute Component={MillStaffNakkhiSalesReport} />
                        ),
                    },
                    {
                        path: 'sales/other/report',
                        element: (
                            <LazyRoute Component={MillStaffOtherSalesReport} />
                        ),
                    },
                    {
                        path: 'input/reports/party',
                        element: <LazyRoute Component={PartyReport} />,
                    },
                    {
                        path: 'input/reports/transporter',
                        element: <LazyRoute Component={TransporterReport} />,
                    },
                    {
                        path: 'input/reports/broker',
                        element: <LazyRoute Component={BrokerReport} />,
                    },
                    {
                        path: 'input/reports/committee',
                        element: <LazyRoute Component={CommitteeReport} />,
                    },
                    {
                        path: 'input/reports/do',
                        element: <LazyRoute Component={DoReport} />,
                    },
                    {
                        path: 'input/reports/vehicle',
                        element: <LazyRoute Component={VehicleReport} />,
                    },
                    {
                        path: 'input/reports/staff',
                        element: <LazyRoute Component={StaffReport} />,
                    },
                    {
                        path: 'input/reports/labour-group',
                        element: <LazyRoute Component={LabourGroupReport} />,
                    },
                ],
            },

            // ==========================================
            // Auth Routes
            // ==========================================
            {
                path: 'sign-in',
                element: <SignIn />,
            },
            {
                path: 'sign-up',
                element: <SignUp />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />,
            },

            // ==========================================
            // Error Routes
            // ==========================================
            {
                path: '404',
                element: <NotFoundPage />,
            },
            {
                path: '401',
                element: <Error401Page />,
            },
            {
                path: '403',
                element: <Error403Page />,
            },
            {
                path: '500',
                element: <Error500Page />,
            },
            {
                path: '503',
                element: <Error503Page />,
            },

            // ==========================================
            // Catch-all Route
            // ==========================================
            {
                path: '*',
                element: <NotFoundError />,
            },
        ],
    },
])
