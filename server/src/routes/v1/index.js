import express from 'express'
import authRoutes from '../../modules/auth/routes/auth.routes.js'
import brokerRoutes from '../../modules/broker/routes/broker.routes.js'
import adminMillRoutes from '../../modules/mill/routes/admin-mill.routes.js'
import millRoutes from '../../modules/mill/routes/mill.routes.js'
import partyRoutes from '../../modules/party/routes/party.routes.js'
import purchaseRoutes from '../../modules/purchase/routes/purchase.routes.js'
import saleRoutes from '../../modules/sale/routes/sale.routes.js'
import staffRoutes from '../../modules/staff/routes/staff.routes.js'
import stockRoutes from '../../modules/stock/routes/stock.routes.js'

const router = express.Router()

/**
 * API v1 Routes
 */

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        version: 'v1',
        timestamp: new Date().toISOString(),
    })
})

// Auth routes
router.use('/auth', authRoutes)

// Mill routes (for mill users)
router.use('/mills', millRoutes)

// Admin mill routes (for super admin)
router.use('/admin/mills', adminMillRoutes)

// Purchase routes (nested under mills)
router.use('/mills/:millId/purchases', purchaseRoutes)

// Sale routes (nested under mills)
router.use('/mills/:millId/sales', saleRoutes)

// Stock routes (nested under mills)
router.use('/mills/:millId/stocks', stockRoutes)

// Party routes (nested under mills)
router.use('/mills/:millId/parties', partyRoutes)

// Broker routes (nested under mills)
router.use('/mills/:millId/brokers', brokerRoutes)

// Staff routes (nested under mills)
router.use('/mills/:millId/staff', staffRoutes)

export default router
