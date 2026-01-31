import express from 'express'
import { ROLES } from '../constants/user.roles.enum.js'
import {
    createUser,
    getUserByIdHandler,
    getUsersListHandler,
    getUsersSummaryHandler,
    updateUserHandler,
    inviteUserHandler,
    suspendUserHandler,
    reactivateUserHandler,
    deleteUserHandler,
    bulkDeleteUsersHandler,
} from '../controllers/users.controller.js'
import { authenticate } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/roleGuard.js'
import { validate } from '../middlewares/validate.js'
import {
    createUserSchema,
    updateUserSchema,
    getUserByIdSchema,
    deleteUserSchema,
    bulkDeleteUsersSchema,
    listUsersSchema,
    summaryUsersSchema,
    inviteUserSchema,
    userActionSchema,
} from '../validators/users.validator.js'

const router = express.Router()

// All routes require authentication and super admin role
router.use(authenticate)
router.use(requireRole([ROLES.SUPER_ADMIN]))

/**
 * Users Routes (Super Admin)
 * Base path: /api/admin/users
 */

// GET /api/admin/users/summary - Get summary statistics
router.get('/summary', validate(summaryUsersSchema), getUsersSummaryHandler)

// GET /api/admin/users - Get list with pagination
router.get('/', validate(listUsersSchema), getUsersListHandler)

// GET /api/admin/users/:id - Get by ID
router.get('/:id', validate(getUserByIdSchema), getUserByIdHandler)

// POST /api/admin/users - Create new user
router.post('/', validate(createUserSchema), createUser)

// POST /api/admin/users/invite - Invite user via email
router.post('/invite', validate(inviteUserSchema), inviteUserHandler)

// PUT /api/admin/users/:id - Update user
router.put('/:id', validate(updateUserSchema), updateUserHandler)

// PATCH /api/admin/users/:id/suspend - Suspend user
router.patch('/:id/suspend', validate(userActionSchema), suspendUserHandler)

// PATCH /api/admin/users/:id/reactivate - Reactivate user
router.patch(
    '/:id/reactivate',
    validate(userActionSchema),
    reactivateUserHandler
)

// DELETE /api/admin/users/bulk - Bulk delete users
router.delete('/bulk', validate(bulkDeleteUsersSchema), bulkDeleteUsersHandler)

// DELETE /api/admin/users/:id - Delete user
router.delete('/:id', validate(deleteUserSchema), deleteUserHandler)

export default router
