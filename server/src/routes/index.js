import express from 'express'
import authRoutes from './auth.routes.js'
import balanceLiftingPartyRoutes from './balance-lifting-party.routes.js'
import brokerTransactionRoutes from './broker-transaction.routes.js'
import brokerRoutes from './broker.routes.js'
import committeeRoutes from './committee.routes.js'
import dailyInwardRoutes from './daily-inward.routes.js'
import dailyMillingRoutes from './daily-milling.routes.js'
import dailyOutwardRoutes from './daily-outward.routes.js'
import dailyPaymentRoutes from './daily-payment.routes.js'
import dailyProductionRoutes from './daily-production.routes.js'
import dailyPurchaseDealRoutes from './daily-purchase-deal.routes.js'
import dailyReceiptRoutes from './daily-receipt.routes.js'
import dailySalesDealRoutes from './daily-sales-deal.routes.js'
import doReportRoutes from './do-report.routes.js'
import financialPaymentRoutes from './financial-payment.routes.js'
import financialReceiptRoutes from './financial-receipt.routes.js'
import frkInwardRoutes from './frk-inward.routes.js'
import frkOutwardRoutes from './frk-outward.routes.js'
import frkPurchaseRoutes from './frk-purchase.routes.js'
import frkSaleRoutes from './frk-sale.routes.js'
import govtGunnyOutwardRoutes from './govt-gunny-outward.routes.js'
import govtPaddyInwardRoutes from './govt-paddy-inward.routes.js'
import govtRiceOutwardRoutes from './govt-rice-outward.routes.js'
import gunnyInwardRoutes from './gunny-inward.routes.js'
import gunnyPurchaseRoutes from './gunny-purchase.routes.js'
import gunnySaleRoutes from './gunny-sale.routes.js'
import labourGroupRoutes from './labour-group.routes.js'
import labourInwardRoutes from './labour-inward.routes.js'
import labourMillingRoutes from './labour-milling.routes.js'
import labourOtherRoutes from './labour-other.routes.js'
import labourOutwardRoutes from './labour-outward.routes.js'
import millingPaddyRoutes from './milling-paddy.routes.js'
import millingRiceRoutes from './milling-rice.routes.js'
import millsRoutes from './mills.routes.js'
import otherInwardRoutes from './other-inward.routes.js'
import otherPurchaseRoutes from './other-purchase.routes.js'
import otherSaleRoutes from './other-sale.routes.js'
import outwardBalancePartyRoutes from './outward-balance-party.routes.js'
import paddyPurchaseRoutes from './paddy-purchase.routes.js'
import partyTransactionRoutes from './party-transaction.routes.js'
import partyRoutes from './party.routes.js'
import privateGunnyOutwardRoutes from './private-gunny-outward.routes.js'
import privatePaddyInwardRoutes from './private-paddy-inward.routes.js'
import privatePaddyOutwardRoutes from './private-paddy-outward.routes.js'
import privateRiceOutwardRoutes from './private-rice-outward.routes.js'
import riceInwardRoutes from './rice-inward.routes.js'
import ricePurchaseRoutes from './rice-purchase.routes.js'
import riceSaleRoutes from './rice-sale.routes.js'
import staffReportRoutes from './staff-report.routes.js'
import staffRoutes from './staff.routes.js'
import stockOverviewRoutes from './stock-overview.routes.js'
import transporterRoutes from './transporter.routes.js'
import usersRoutes from './users.routes.js'
import vehicleRoutes from './vehicle.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)

// Super Admin routes
router.use('/admin/mills', millsRoutes)
router.use('/admin/users', usersRoutes)

// Mill-specific routes (nested under /mills/:millId)
router.use('/mills/:millId/stock-overview', stockOverviewRoutes)
router.use('/mills/:millId/daily-inwards', dailyInwardRoutes)
router.use('/mills/:millId/daily-outwards', dailyOutwardRoutes)
router.use('/mills/:millId/daily-milling', dailyMillingRoutes)
router.use('/mills/:millId/daily-payments', dailyPaymentRoutes)
router.use('/mills/:millId/daily-receipts', dailyReceiptRoutes)
router.use('/mills/:millId/daily-production', dailyProductionRoutes)
router.use('/mills/:millId/daily-purchase-deals', dailyPurchaseDealRoutes)
router.use('/mills/:millId/daily-sales-deals', dailySalesDealRoutes)
router.use('/mills/:millId/govt-paddy-inward', govtPaddyInwardRoutes)
router.use('/mills/:millId/govt-gunny-outward', govtGunnyOutwardRoutes)
router.use('/mills/:millId/govt-rice-outward', govtRiceOutwardRoutes)
router.use('/mills/:millId/milling-paddy', millingPaddyRoutes)
router.use('/mills/:millId/paddy-purchase', paddyPurchaseRoutes)
router.use('/mills/:millId/private-paddy-inward', privatePaddyInwardRoutes)
router.use('/mills/:millId/rice-sales', riceSaleRoutes)
router.use('/mills/:millId/staff', staffRoutes)

// Labour Cost Reports
router.use('/mills/:millId/labour-inward', labourInwardRoutes)
router.use('/mills/:millId/labour-milling', labourMillingRoutes)
router.use('/mills/:millId/labour-outward', labourOutwardRoutes)
router.use('/mills/:millId/labour-other', labourOtherRoutes)

// Input Reports - Party & Broker
router.use('/mills/:millId/parties', partyRoutes)
router.use('/mills/:millId/brokers', brokerRoutes)

// Financial Transaction Reports
router.use('/mills/:millId/financial-payments', financialPaymentRoutes)
router.use('/mills/:millId/financial-receipts', financialReceiptRoutes)

// Transaction Reports
router.use('/mills/:millId/party-transactions', partyTransactionRoutes)
router.use('/mills/:millId/broker-transactions', brokerTransactionRoutes)

// Inward Reports
router.use('/mills/:millId/rice-inward', riceInwardRoutes)
router.use('/mills/:millId/gunny-inward', gunnyInwardRoutes)
router.use('/mills/:millId/frk-inward', frkInwardRoutes)
router.use('/mills/:millId/frk-outward', frkOutwardRoutes)
router.use('/mills/:millId/other-inward', otherInwardRoutes)

// Outward Reports
router.use('/mills/:millId/private-paddy-outward', privatePaddyOutwardRoutes)
router.use('/mills/:millId/private-gunny-outward', privateGunnyOutwardRoutes)
router.use('/mills/:millId/private-rice-outward', privateRiceOutwardRoutes)

// Purchase Reports
router.use('/mills/:millId/rice-purchase', ricePurchaseRoutes)
router.use('/mills/:millId/gunny-purchase', gunnyPurchaseRoutes)
router.use('/mills/:millId/frk-purchase', frkPurchaseRoutes)
router.use('/mills/:millId/other-purchase', otherPurchaseRoutes)

// Sales Reports
router.use('/mills/:millId/gunny-sales', gunnySaleRoutes)
router.use('/mills/:millId/frk-sales', frkSaleRoutes)
router.use('/mills/:millId/other-sales', otherSaleRoutes)

// Balance Lifting Reports
router.use('/mills/:millId/balance-lifting-party', balanceLiftingPartyRoutes)

// Outward Balance Lifting Reports
router.use('/mills/:millId/outward-balance-party', outwardBalancePartyRoutes)

// Milling Reports
router.use('/mills/:millId/milling-rice', millingRiceRoutes)

// Input Reports - Transporter, Vehicle, Labour Group, Committee, DO Report, Staff Report
router.use('/mills/:millId/transporters', transporterRoutes)
router.use('/mills/:millId/vehicles', vehicleRoutes)
router.use('/mills/:millId/labour-groups', labourGroupRoutes)
router.use('/mills/:millId/committees', committeeRoutes)
router.use('/mills/:millId/do-reports', doReportRoutes)
router.use('/mills/:millId/staff-reports', staffReportRoutes)

export default router
