import ApiError from '../utils/ApiError.js';

export const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required', 'UNAUTHORIZED'));
    }
    
    // super-admin and mill-admin have all permissions
    if (['super-admin', 'mill-admin'].includes(req.user.role)) {
      return next();
    }
    
    // Check if mill-staff has required permission
    const hasPermission = permissions.some(permission =>
      req.user.permissions?.includes(permission)
    );
    
    if (!hasPermission) {
      return next(ApiError.forbidden('Insufficient permissions', 'INSUFFICIENT_PERMISSIONS'));
    }
    
    next();
  };
};

// Available permissions for mill-staff
export const PERMISSIONS = {
  // Purchases
  PURCHASES_CREATE: 'purchases.create',
  PURCHASES_READ: 'purchases.read',
  PURCHASES_UPDATE: 'purchases.update',
  PURCHASES_DELETE: 'purchases.delete',
  
  // Sales
  SALES_CREATE: 'sales.create',
  SALES_READ: 'sales.read',
  SALES_UPDATE: 'sales.update',
  SALES_DELETE: 'sales.delete',
  
  // Inventory
  INVENTORY_READ: 'inventory.read',
  INVENTORY_MANAGE: 'inventory.manage',
  
  // Inward
  INWARD_CREATE: 'inward.create',
  INWARD_READ: 'inward.read',
  INWARD_UPDATE: 'inward.update',
  INWARD_DELETE: 'inward.delete',
  
  // Outward
  OUTWARD_CREATE: 'outward.create',
  OUTWARD_READ: 'outward.read',
  OUTWARD_UPDATE: 'outward.update',
  OUTWARD_DELETE: 'outward.delete',
  
  // Milling
  MILLING_CREATE: 'milling.create',
  MILLING_READ: 'milling.read',
  MILLING_UPDATE: 'milling.update',
  MILLING_DELETE: 'milling.delete',
  
  // Financial
  FINANCIAL_CREATE: 'financial.create',
  FINANCIAL_READ: 'financial.read',
  FINANCIAL_UPDATE: 'financial.update',
  FINANCIAL_DELETE: 'financial.delete',
  
  // Reports
  REPORTS_DAILY: 'reports.daily',
  REPORTS_TRANSACTION: 'reports.transaction',
  REPORTS_INPUT: 'reports.input',
  
  // Input Data
  INPUTDATA_PARTIES: 'inputdata.parties',
  INPUTDATA_BROKERS: 'inputdata.brokers',
  INPUTDATA_TRANSPORTERS: 'inputdata.transporters',
  INPUTDATA_COMMITTEES: 'inputdata.committees',
  INPUTDATA_VEHICLES: 'inputdata.vehicles',
  INPUTDATA_STAFF: 'inputdata.staff',
  
  // Attendance
  ATTENDANCE_CREATE: 'attendance.create',
  ATTENDANCE_READ: 'attendance.read',
};
