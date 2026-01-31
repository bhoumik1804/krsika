import { Router } from 'express'
import {
    createVehicle,
    getVehicleByIdHandler,
    getVehicleListHandler,
    getVehicleSummaryHandler,
    updateVehicleHandler,
    deleteVehicleHandler,
    bulkDeleteVehicleHandler,
} from '../controllers/vehicle.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import {
    createVehicleSchema,
    updateVehicleSchema,
    getVehicleByIdSchema,
    deleteVehicleSchema,
    bulkDeleteVehicleSchema,
    getVehicleListSchema,
    getVehicleSummarySchema,
} from '../validators/vehicle.validator.js'

const router = Router({ mergeParams: true })

/**
 * Vehicle Routes
 * Base path: /api/mills/:millId/vehicles
 */

// Get vehicle list with pagination
router.get(
    '/',
    authenticate,
    validate(getVehicleListSchema),
    getVehicleListHandler
)

// Get vehicle summary statistics
router.get(
    '/summary',
    authenticate,
    validate(getVehicleSummarySchema),
    getVehicleSummaryHandler
)

// Get vehicle by ID
router.get(
    '/:id',
    authenticate,
    validate(getVehicleByIdSchema),
    getVehicleByIdHandler
)

// Create a new vehicle
router.post('/', authenticate, validate(createVehicleSchema), createVehicle)

// Update a vehicle
router.put(
    '/:id',
    authenticate,
    validate(updateVehicleSchema),
    updateVehicleHandler
)

// Bulk delete vehicles
router.delete(
    '/bulk',
    authenticate,
    validate(bulkDeleteVehicleSchema),
    bulkDeleteVehicleHandler
)

// Delete a vehicle
router.delete(
    '/:id',
    authenticate,
    validate(deleteVehicleSchema),
    deleteVehicleHandler
)

export default router
