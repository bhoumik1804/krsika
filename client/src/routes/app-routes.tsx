import { lazy, Suspense } from 'react'
import { USER_ROLES } from '@/constants'
import { AuthSuccess } from '@/pages/auth/auth-success'
// Auth routes
import { ForgotPassword } from '@/pages/auth/forgot-password'
import { GoogleAuthError } from '@/pages/auth/google-auth-error'
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
import { ProtectedRoute } from '@/routes/protected-route'
import { RootLayout } from '@/routes/root-layout'
import { createBrowserRouter } from 'react-router'
// import { ComingSoon } from '@/components/coming-soon'
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

// Mill Admin Input Reports
const MillAdminPartyReport = lazy(() =>
    import('@/pages/mill-admin/input-reports/party-report').then((m) => ({
        default: m.PartyReport,
    }))
)
const MillAdminTransporterReport = lazy(() =>
    import('@/pages/mill-admin/input-reports/transporter-report').then((m) => ({
        default: m.TransporterReport,
    }))
)
const MillAdminBrokerReport = lazy(() =>
    import('@/pages/mill-admin/input-reports/broker-report').then((m) => ({
        default: m.BrokerReport,
    }))
)
const MillAdminCommitteeReport = lazy(() =>
    import('@/pages/mill-admin/input-reports/committee-report').then((m) => ({
        default: m.CommitteeReport,
    }))
)
const MillAdminDoReport = lazy(() =>
    import('@/pages/mill-admin/input-reports/do-report').then((m) => ({
        default: m.DoReport,
    }))
)
const MillAdminVehicleReport = lazy(() =>
    import('@/pages/mill-admin/input-reports/vehicle-report').then((m) => ({
        default: m.VehicleReport,
    }))
)
const MillAdminStaffReport = lazy(() =>
    import('@/pages/mill-admin/input-reports/staff-report').then((m) => ({
        default: m.StaffReport,
    }))
)
const MillAdminLabourGroupReport = lazy(() =>
    import('@/pages/mill-admin/input-reports/labour-group-report').then(
        (m) => ({
            default: m.LabourGroupReport,
        })
    )
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

// Wrapper for lazy components with Suspense and Permission check
function LazyRoute({
    Component,
    moduleSlug,
}: {
    Component: React.ComponentType
    moduleSlug?: string
}) {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute moduleSlug={moduleSlug}>
                <Component />
            </ProtectedRoute>
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
                element: (
                    <ProtectedRoute requiredRoles={[USER_ROLES.SUPER_ADMIN]}>
                        <SuperAdminLayout />
                    </ProtectedRoute>
                ),
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
                ],
            },

            // ==========================================
            // Mill Admin Routes (/mill/:millId/*)
            // ==========================================
            {
                path: 'mill/:millId',
                element: (
                    <ProtectedRoute
                        requiredRoles={[
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.MILL_ADMIN,
                        ]}
                    >
                        <MillAdminLayout />
                    </ProtectedRoute>
                ),
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
                            <LazyRoute Component={BrokerTransactionReport} moduleSlug='broker-transaction' />
                        ),
                    },
                    {
                        path: 'transaction/party',
                        element: (
                            <LazyRoute Component={PartyTransactionReport} moduleSlug='party-transaction' />
                        ),
                    },
                    {
                        path: 'purchases/paddy/report',
                        element: <LazyRoute Component={PaddyPurchaseReport} moduleSlug='paddy-purchase-report' />,
                    },
                    {
                        path: 'purchases/rice/report',
                        element: <LazyRoute Component={RicePurchaseReport} moduleSlug='rice-purchase-report' />,
                    },
                    {
                        path: 'purchases/gunny/report',
                        element: <LazyRoute Component={GunnyPurchaseReport} moduleSlug='gunny-purchase-report' />,
                    },
                    {
                        path: 'purchases/frk/report',
                        element: <LazyRoute Component={FrkPurchaseReport} moduleSlug='frk-purchase-report' />,
                    },
                    {
                        path: 'purchases/other/report',
                        element: <LazyRoute Component={OtherPurchaseReport} moduleSlug='other-purchase-report' />,
                    },
                    {
                        path: 'balance/lifting/report/purchases/paddy',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingPurchasesPaddyReport}
                                moduleSlug='balance-lifting-paddy-purchase'
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/rice',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingPurchasesRiceReport}
                                moduleSlug='balance-lifting-rice-purchase'
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/gunny',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingPurchasesGunnyReport}
                                moduleSlug='balance-lifting-gunny-purchase'
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/purchases/frk',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingPurchasesFrkReport}
                                moduleSlug='balance-lifting-frk-purchase'
                            />
                        ),
                    },
                    {
                        path: 'balance/lifting/report/sales/paddy',
                        element: (
                            <LazyRoute
                                Component={BalanceLiftingSalesPaddyReport}
                                moduleSlug='balance-lifting-paddy-sales'
                            />
                        ),
                    },
                    {
                        path: 'outward/balance/lifting/report/rice',
                        element: (
                            <LazyRoute
                                Component={OutwardBalanceLiftingRiceReport}
                                moduleSlug='outward-balance-lifting-rice-sales'
                            />
                        ),
                    },
                    {
                        path: 'sales/rice/report',
                        element: <LazyRoute Component={RiceSalesReport} moduleSlug='rice-sales-report' />,
                    },
                    {
                        path: 'sales/paddy/report',
                        element: <LazyRoute Component={PaddySalesReport} moduleSlug='paddy-sales-report' />,
                    },
                    {
                        path: 'sales/gunny/report',
                        element: <LazyRoute Component={GunnySalesReport} moduleSlug='gunny-sales-report' />,
                    },
                    {
                        path: 'sales/khanda/report',
                        element: <LazyRoute Component={KhandaSalesReport} moduleSlug='khanda-sales-report' />,
                    },
                    {
                        path: 'sales/nakkhi/report',
                        element: <LazyRoute Component={NakkhiSalesReport} moduleSlug='nakkhi-sales-report' />,
                    },
                    {
                        path: 'sales/other/report',
                        element: <LazyRoute Component={OtherSalesReport} moduleSlug='other-sales-report' />,
                    },
                    {
                        path: 'inward/govt/paddy/report',
                        element: (
                            <LazyRoute Component={GovtPaddyInwardReport} moduleSlug='inward-govt-paddy' />
                        ),
                    },
                    {
                        path: 'inward/private/paddy/report',
                        element: (
                            <LazyRoute Component={PrivatePaddyInwardReport} moduleSlug='inward-private-paddy' />
                        ),
                    },
                    {
                        path: 'inward/rice/report',
                        element: <LazyRoute Component={RiceInwardReport} moduleSlug='inward-rice' />,
                    },
                    {
                        path: 'inward/gunny/report',
                        element: <LazyRoute Component={GunnyInwardReport} moduleSlug='inward-gunny' />,
                    },
                    {
                        path: 'inward/other/report',
                        element: <LazyRoute Component={OtherInwardReport} moduleSlug='inward-other' />,
                    },
                    {
                        path: 'inward/frk/report',
                        element: <LazyRoute Component={FrkInwardReport} moduleSlug='inward-frk' />,
                    },
                    {
                        path: 'outward/private/paddy/report',
                        element: (
                            <LazyRoute Component={PrivatePaddyOutwardReport} moduleSlug='outward-private-paddy' />
                        ),
                    },
                    {
                        path: 'outward/private/rice/report',
                        element: (
                            <LazyRoute Component={PrivateRiceOutwardReport} moduleSlug='outward-private-rice' />
                        ),
                    },
                    {
                        path: 'outward/govt/rice/report',
                        element: (
                            <LazyRoute Component={GovtRiceOutwardReport} moduleSlug='outward-govt-rice' />
                        ),
                    },
                    {
                        path: 'outward/govt/gunny/report',
                        element: (
                            <LazyRoute Component={GovtGunnyOutwardReport} moduleSlug='outward-govt-gunny' />
                        ),
                    },
                    {
                        path: 'outward/private/gunny/report',
                        element: (
                            <LazyRoute Component={PrivateGunnyOutwardReport} moduleSlug='outward-private-gunny' />
                        ),
                    },
                    {
                        path: 'outward/frk/report',
                        element: <LazyRoute Component={FrkOutwardReport} moduleSlug='outward-frk' />,
                    },
                    {
                        path: 'outward/khanda/report',
                        element: <LazyRoute Component={KhandaOutwardReport} moduleSlug='outward-khanda' />,
                    },
                    {
                        path: 'outward/nakkhi/report',
                        element: <LazyRoute Component={NakkhiOutwardReport} moduleSlug='outward-nakkhi' />,
                    },
                    {
                        path: 'outward/bhusa/report',
                        element: <LazyRoute Component={BhusaOutwardReport} moduleSlug='outward-bhusa' />,
                    },
                    {
                        path: 'outward/kodha/report',
                        element: <LazyRoute Component={KodhaOutwardReport} moduleSlug='outward-kodha' />,
                    },
                    {
                        path: 'outward/silky-kodha/report',
                        element: (
                            <LazyRoute Component={SilkyKodhaOutwardReport} moduleSlug='outward-silky-kodha' />
                        ),
                    },
                    {
                        path: 'outward/other/report',
                        element: <LazyRoute Component={OtherOutwardReport} moduleSlug='outward-other' />,
                    },
                    {
                        path: 'milling/paddy/report',
                        element: <LazyRoute Component={MillingPaddyReport} moduleSlug='paddy-milling-report' />,
                    },
                    {
                        path: 'milling/rice/report',
                        element: <LazyRoute Component={MillingRiceReport} moduleSlug='rice-milling-report' />,
                    },
                    {
                        path: 'labour/inward/report',
                        element: <LazyRoute Component={LabourInwardReport} moduleSlug='inward-labour-cost-report' />,
                    },
                    {
                        path: 'labour/outward/report',
                        element: <LazyRoute Component={LabourOutwardReport} moduleSlug='outward-labour-cost-report' />,
                    },
                    {
                        path: 'labour/milling/report',
                        element: <LazyRoute Component={LabourMillingReport} moduleSlug='milling-labour-cost-report' />,
                    },
                    {
                        path: 'labour/other/report',
                        element: <LazyRoute Component={LabourOtherReport} moduleSlug='other-labour-cost-report' />,
                    },
                    {
                        path: 'financial/transaction/receipt/report',
                        element: (
                            <LazyRoute Component={FinancialReceiptReport} moduleSlug='financial-receipt-report' />
                        ),
                    },
                    {
                        path: 'financial/transaction/payment/report',
                        element: (
                            <LazyRoute Component={FinancialPaymentReport} moduleSlug='financial-payment-report' />
                        ),
                    },
                    {
                        path: 'stock/overview/report',
                        element: <LazyRoute Component={StockOverviewReport} moduleSlug='stock-overview' />,
                    },
                    {
                        path: 'daily/reports',
                        element: (
                            <LazyRoute
                                Component={MillStaffDailyReportsOverview}
                                moduleSlug='daily-reports-overview'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/purchase',
                        element: <LazyRoute Component={PurchaseDealsReport} moduleSlug='daily-receipt' />,
                    },
                    {
                        path: 'daily/reports/sales',
                        element: <LazyRoute Component={SalesDealsReport} moduleSlug='daily-payment' />,
                    },
                    {
                        path: 'daily/reports/inwards',
                        element: <LazyRoute Component={InwardsReport} moduleSlug='daily-reports-overview' />,
                    },
                    {
                        path: 'daily/reports/outwards',
                        element: <LazyRoute Component={OutwardsReport} moduleSlug='daily-reports-overview' />,
                    },
                    {
                        path: 'daily/reports/milling',
                        element: <LazyRoute Component={MillingReport} moduleSlug='daily-reports-overview' />,
                    },
                    {
                        path: 'daily/reports/production',
                        element: <LazyRoute Component={ProductionReport} moduleSlug='daily-reports-overview' />,
                    },
                    {
                        path: 'daily/reports/receipt',
                        element: <LazyRoute Component={ReceiptReport} moduleSlug='daily-receipt' />,
                    },
                    {
                        path: 'daily/reports/payment',
                        element: <LazyRoute Component={PaymentReport} moduleSlug='daily-payment' />,
                    },
                    {
                        path: 'input/reports/party',
                        element: <LazyRoute Component={MillAdminPartyReport} moduleSlug='party-report' />,
                    },
                    {
                        path: 'input/reports/transporter',
                        element: (
                            <LazyRoute Component={MillAdminTransporterReport} moduleSlug='transporter-report' />
                        ),
                    },
                    {
                        path: 'input/reports/broker',
                        element: (
                            <LazyRoute Component={MillAdminBrokerReport} moduleSlug='broker-report' />
                        ),
                    },
                    {
                        path: 'input/reports/committee',
                        element: (
                            <LazyRoute Component={MillAdminCommitteeReport} moduleSlug='committee-report' />
                        ),
                    },
                    {
                        path: 'input/reports/do',
                        element: <LazyRoute Component={MillAdminDoReport} moduleSlug='do-report' />,
                    },
                    {
                        path: 'input/reports/vehicle',
                        element: (
                            <LazyRoute Component={MillAdminVehicleReport} moduleSlug='vehicle-report' />
                        ),
                    },
                    {
                        path: 'input/reports/staff',
                        element: <LazyRoute Component={MillAdminStaffReport} moduleSlug='staff-report' />,
                    },
                    {
                        path: 'input/reports/labour-group',
                        element: (
                            <LazyRoute Component={MillAdminLabourGroupReport} moduleSlug='labour-group-report' />
                        ),
                    },
                ],
            },

            // ==========================================
            // Mill Staff Routes (/staff/:millId/:staffId/*)
            // ==========================================
            {
                path: 'staff/:millId',
                element: (
                    <ProtectedRoute
                        requiredRoles={[
                            USER_ROLES.SUPER_ADMIN,
                            USER_ROLES.MILL_STAFF,
                        ]}
                    >
                        <MillStaffLayout />
                    </ProtectedRoute>
                ),
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
                                moduleSlug='broker-transaction'
                            />
                        ),
                    },
                    {
                        path: 'transaction/party',
                        element: (
                            <LazyRoute
                                Component={MillStaffPartyTransactionReport}
                                moduleSlug='party-transaction'
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
                                moduleSlug='balance-lifting-paddy-purchase'
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
                                moduleSlug='balance-lifting-rice-purchase'
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
                                moduleSlug='balance-lifting-gunny-purchase'
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
                                moduleSlug='balance-lifting-frk-purchase'
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
                                moduleSlug='balance-lifting-paddy-sales'
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
                                moduleSlug='outward-balance-lifting-rice-sales'
                            />
                        ),
                    },
                    {
                        path: 'inward/govt/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGovtPaddyInwardReport}
                                moduleSlug='inward-govt-paddy'
                            />
                        ),
                    },
                    {
                        path: 'inward/private/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPrivatePaddyInwardReport}
                                moduleSlug='inward-private-paddy'
                            />
                        ),
                    },
                    {
                        path: 'inward/rice/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffRiceInwardReport}
                                moduleSlug='inward-rice'
                            />
                        ),
                    },
                    {
                        path: 'inward/gunny/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGunnyInwardReport}
                                moduleSlug='inward-gunny'
                            />
                        ),
                    },
                    {
                        path: 'inward/other/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffOtherInwardReport}
                                moduleSlug='inward-other'
                            />
                        ),
                    },
                    {
                        path: 'inward/frk/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffFrkInwardReport}
                                moduleSlug='inward-frk'
                            />
                        ),
                    },
                    {
                        path: 'outward/private/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPrivatePaddyOutwardReport}
                                moduleSlug='outward-private-paddy'
                            />
                        ),
                    },
                    {
                        path: 'outward/private/rice/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPrivateRiceOutwardReport}
                                moduleSlug='outward-private-rice'
                            />
                        ),
                    },
                    {
                        path: 'outward/govt/rice/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGovtRiceOutwardReport}
                                moduleSlug='outward-govt-rice'
                            />
                        ),
                    },
                    {
                        path: 'outward/govt/gunny/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGovtGunnyOutwardReport}
                                moduleSlug='outward-govt-gunny'
                            />
                        ),
                    },
                    {
                        path: 'outward/private/gunny/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPrivateGunnyOutwardReport}
                                moduleSlug='outward-private-gunny'
                            />
                        ),
                    },
                    {
                        path: 'outward/frk/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffFrkOutwardReport}
                                moduleSlug='outward-frk'
                            />
                        ),
                    },
                    {
                        path: 'outward/khanda/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffKhandaOutwardReport}
                                moduleSlug='outward-khanda'
                            />
                        ),
                    },
                    {
                        path: 'outward/nakkhi/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffNakkhiOutwardReport}
                                moduleSlug='outward-nakkhi'
                            />
                        ),
                    },
                    {
                        path: 'outward/bhusa/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffBhusaOutwardReport}
                                moduleSlug='outward-bhusa'
                            />
                        ),
                    },
                    {
                        path: 'outward/kodha/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffKodhaOutwardReport}
                                moduleSlug='outward-kodha'
                            />
                        ),
                    },
                    {
                        path: 'outward/silky-kodha/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffSilkyKodhaOutwardReport}
                                moduleSlug='outward-silky-kodha'
                            />
                        ),
                    },
                    {
                        path: 'outward/other/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffOtherOutwardReport}
                                moduleSlug='outward-other'
                            />
                        ),
                    },
                    {
                        path: 'milling/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffMillingPaddyReport}
                                moduleSlug='paddy-milling-report'
                            />
                        ),
                    },
                    {
                        path: 'milling/rice/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffMillingRiceReport}
                                moduleSlug='rice-milling-report'
                            />
                        ),
                    },
                    {
                        path: 'labour/inward/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffLabourInwardReport}
                                moduleSlug='inward-labour-cost-report'
                            />
                        ),
                    },
                    {
                        path: 'labour/outward/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffLabourOutwardReport}
                                moduleSlug='outward-labour-cost-report'
                            />
                        ),
                    },
                    {
                        path: 'labour/milling/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffLabourMillingReport}
                                moduleSlug='milling-labour-cost-report'
                            />
                        ),
                    },
                    {
                        path: 'labour/other/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffLabourOtherReport}
                                moduleSlug='other-labour-cost-report'
                            />
                        ),
                    },
                    {
                        path: 'financial/transaction/receipt/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffFinancialReceiptReport}
                                moduleSlug='financial-receipt-report'
                            />
                        ),
                    },
                    {
                        path: 'financial/transaction/payment/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffFinancialPaymentReport}
                                moduleSlug='financial-payment-report'
                            />
                        ),
                    },
                    {
                        path: 'stock/overview/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffStockOverviewReport}
                                moduleSlug='stock-overview'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports',
                        element: (
                            <LazyRoute
                                Component={MillStaffDailyReportsOverview}
                                moduleSlug='daily-reports-overview'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/purchase',
                        element: (
                            <LazyRoute
                                Component={MillStaffPurchaseDealsReport}
                                moduleSlug='daily-receipt'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/sales',
                        element: (
                            <LazyRoute
                                Component={MillStaffSalesDealsReport}
                                moduleSlug='daily-payment'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/inwards',
                        element: (
                            <LazyRoute
                                Component={MillStaffInwardsReport}
                                moduleSlug='daily-reports-overview'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/outwards',
                        element: (
                            <LazyRoute
                                Component={MillStaffOutwardsReport}
                                moduleSlug='daily-reports-overview'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/milling',
                        element: (
                            <LazyRoute
                                Component={MillStaffMillingReport}
                                moduleSlug='daily-reports-overview'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/production',
                        element: (
                            <LazyRoute
                                Component={MillStaffProductionReport}
                                moduleSlug='daily-reports-overview'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/receipt',
                        element: (
                            <LazyRoute
                                Component={MillStaffReceiptReport}
                                moduleSlug='daily-receipt'
                            />
                        ),
                    },
                    {
                        path: 'daily/reports/payment',
                        element: (
                            <LazyRoute
                                Component={MillStaffPaymentReport}
                                moduleSlug='daily-payment'
                            />
                        ),
                    },
                    {
                        path: 'purchases/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPaddyPurchaseReport}
                                moduleSlug='paddy-purchase-report'
                            />
                        ),
                    },
                    {
                        path: 'purchases/rice/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffRicePurchaseReport}
                                moduleSlug='rice-purchase-report'
                            />
                        ),
                    },
                    {
                        path: 'purchases/gunny/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGunnyPurchaseReport}
                                moduleSlug='gunny-purchase-report'
                            />
                        ),
                    },
                    {
                        path: 'purchases/frk/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffFrkPurchaseReport}
                                moduleSlug='frk-purchase-report'
                            />
                        ),
                    },
                    {
                        path: 'purchases/other/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffOtherPurchaseReport}
                                moduleSlug='other-purchase-report'
                            />
                        ),
                    },
                    {
                        path: 'sales/rice/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffRiceSalesReport}
                                moduleSlug='rice-sales-report'
                            />
                        ),
                    },
                    {
                        path: 'sales/paddy/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffPaddySalesReport}
                                moduleSlug='paddy-sales-report'
                            />
                        ),
                    },
                    {
                        path: 'sales/gunny/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffGunnySalesReport}
                                moduleSlug='gunny-sales-report'
                            />
                        ),
                    },
                    {
                        path: 'sales/khanda/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffKhandaSalesReport}
                                moduleSlug='khanda-sales-report'
                            />
                        ),
                    },
                    {
                        path: 'sales/nakkhi/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffNakkhiSalesReport}
                                moduleSlug='nakkhi-sales-report'
                            />
                        ),
                    },
                    {
                        path: 'sales/other/report',
                        element: (
                            <LazyRoute
                                Component={MillStaffOtherSalesReport}
                                moduleSlug='other-sales-report'
                            />
                        ),
                    },
                    {
                        path: 'input/reports/party',
                        element: (
                            <LazyRoute
                                Component={PartyReport}
                                moduleSlug='party-report'
                            />
                        ),
                    },
                    {
                        path: 'input/reports/transporter',
                        element: (
                            <LazyRoute
                                Component={TransporterReport}
                                moduleSlug='transporter-report'
                            />
                        ),
                    },
                    {
                        path: 'input/reports/broker',
                        element: (
                            <LazyRoute
                                Component={BrokerReport}
                                moduleSlug='broker-report'
                            />
                        ),
                    },
                    {
                        path: 'input/reports/committee',
                        element: (
                            <LazyRoute
                                Component={CommitteeReport}
                                moduleSlug='committee-report'
                            />
                        ),
                    },
                    {
                        path: 'input/reports/do',
                        element: (
                            <LazyRoute Component={DoReport} moduleSlug='do-report' />
                        ),
                    },
                    {
                        path: 'input/reports/vehicle',
                        element: (
                            <LazyRoute
                                Component={VehicleReport}
                                moduleSlug='vehicle-report'
                            />
                        ),
                    },
                    {
                        path: 'input/reports/staff',
                        element: (
                            <LazyRoute
                                Component={StaffReport}
                                moduleSlug='staff-report'
                            />
                        ),
                    },
                    {
                        path: 'input/reports/labour-group',
                        element: (
                            <LazyRoute
                                Component={LabourGroupReport}
                                moduleSlug='labour-group-report'
                            />
                        ),
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
            {
                path: 'auth-success',
                element: <AuthSuccess />,
            },
            {
                path: 'google-auth-error',
                element: <GoogleAuthError />,
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
