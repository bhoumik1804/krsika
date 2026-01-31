export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            const error = new Error('Authentication required')
            error.statusCode = 401
            return next(error)
        }

        if (!roles.includes(req.user.role)) {
            const error = new Error('Access denied')
            error.statusCode = 403
            return next(error)
        }

        next()
    }
}

export const requireSuperAdmin = requireRole('super-admin')
export const requireMillAdmin = requireRole('mill-admin')
export const requireMillStaff = requireRole('mill-staff')
