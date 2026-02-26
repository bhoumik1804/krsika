import express from 'express'
import {
    getPartyReportHandler,
    getBrokerReportHandler,
} from '../controllers/transaction-report.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { partyReportSchema, brokerReportSchema } from '../validators/transaction-report.validator.js'

const router = express.Router({ mergeParams: true })

router.use(authenticate)

/**
 * Transaction Report Routes
 * Base path: /api/mills/:millId/transaction-reports
 * Aggregates real data from DailyPurchaseDeal, DailySalesDeal, DailyInward,
 * DailyOutward, DailyReceipt, DailyPayment
 */

// GET /api/mills/:millId/transaction-reports/party
router.get('/party', validate(partyReportSchema), getPartyReportHandler)

// GET /api/mills/:millId/transaction-reports/broker
router.get('/broker', validate(brokerReportSchema), getBrokerReportHandler)

export default router
