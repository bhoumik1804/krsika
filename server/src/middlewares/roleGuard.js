import ApiError from '../utils/ApiError.js';

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required', 'UNAUTHORIZED'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Access denied', 'FORBIDDEN'));
    }
    
    next();
  };
};

export const requireSuperAdmin = requireRole('super-admin');
export const requireMillAdmin = requireRole('mill-admin');
export const requireMillStaff = requireRole('mill-staff');
export const requireAdminOrMillAdmin = requireRole('super-admin', 'mill-admin');
