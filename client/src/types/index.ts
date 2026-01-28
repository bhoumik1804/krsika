/**
 * Centralized Type Definitions
 * These types are designed to match backend API schemas for seamless integration
 */

// ==========================================
// User & Authentication Types
// ==========================================

export type UserRole = 'super-admin' | 'mill-admin' | 'mill-staff'

export interface User {
    id: string
    email: string
    name: string
    avatar?: string
    role: UserRole
    millId?: string // Required for mill-admin and mill-staff
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
    expiresIn: number
}

// ==========================================
// Mill Types
// ==========================================

export type MillStatus = 'active' | 'inactive' | 'suspended' | 'pending'
export type SubscriptionPlan = 'basic' | 'professional' | 'enterprise'

export interface Mill {
    id: string
    name: string
    code: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
    email: string
    gstNumber?: string
    panNumber?: string
    status: MillStatus
    subscriptionPlan: SubscriptionPlan
    subscriptionExpiresAt: string
    ownerId: string
    createdAt: string
    updatedAt: string
}

export interface MillStats {
    totalInventoryValue: number
    todayPurchases: number
    todaySales: number
    pendingPayments: number
    activeStaff: number
}

// ==========================================
// Inventory Types
// ==========================================

export type StockType = 'paddy' | 'rice' | 'bran' | 'husk' | 'broken-rice'
export type StockUnit = 'kg' | 'quintal' | 'ton' | 'bag'

export interface InventoryItem {
    id: string
    millId: string
    type: StockType
    variety: string
    quantity: number
    unit: StockUnit
    ratePerUnit: number
    totalValue: number
    warehouseLocation?: string
    lastUpdated: string
    createdAt: string
}

export interface InventorySummary {
    totalPaddy: number
    totalRice: number
    totalByProducts: number
    totalValue: number
}

// ==========================================
// Purchase Types
// ==========================================

export type PurchaseStatus = 'pending' | 'received' | 'partial' | 'cancelled'
export type PaymentStatus = 'pending' | 'partial' | 'paid'

export interface Purchase {
    id: string
    purchaseNumber: string
    millId: string
    farmerId: string
    farmerName: string
    stockType: StockType
    variety: string
    quantity: number
    unit: StockUnit
    ratePerUnit: number
    totalAmount: number
    paidAmount: number
    paymentStatus: PaymentStatus
    status: PurchaseStatus
    vehicleNumber?: string
    gateEntryId?: string
    notes?: string
    purchaseDate: string
    createdAt: string
    updatedAt: string
}

export interface GateEntry {
    id: string
    entryNumber: string
    millId: string
    vehicleNumber: string
    driverName: string
    driverPhone: string
    farmerId?: string
    farmerName: string
    stockType: StockType
    variety: string
    grossWeight: number
    tareWeight: number
    netWeight: number
    unit: StockUnit
    moisture?: number
    quality?: string
    notes?: string
    entryTime: string
    exitTime?: string
    createdBy: string
    createdAt: string
}

// ==========================================
// Sales Types
// ==========================================

export type SalesStatus =
    | 'pending'
    | 'confirmed'
    | 'dispatched'
    | 'delivered'
    | 'cancelled'

export interface Sale {
    id: string
    invoiceNumber: string
    millId: string
    customerId: string
    customerName: string
    stockType: StockType
    variety: string
    quantity: number
    unit: StockUnit
    ratePerUnit: number
    totalAmount: number
    taxAmount: number
    discountAmount: number
    netAmount: number
    paidAmount: number
    paymentStatus: PaymentStatus
    status: SalesStatus
    deliveryAddress?: string
    notes?: string
    saleDate: string
    createdAt: string
    updatedAt: string
}

// ==========================================
// Processing Types
// ==========================================

export type ProcessingStatus = 'in-progress' | 'completed' | 'cancelled'

export interface ProcessingBatch {
    id: string
    batchNumber: string
    millId: string
    inputType: StockType
    inputVariety: string
    inputQuantity: number
    inputUnit: StockUnit
    outputRice: number
    outputBran: number
    outputHusk: number
    outputBroken: number
    conversionRate: number
    status: ProcessingStatus
    startTime: string
    endTime?: string
    notes?: string
    createdBy: string
    createdAt: string
}

// ==========================================
// Customer & Farmer Types
// ==========================================

export type CustomerType = 'retail' | 'wholesale' | 'distributor' | 'exporter'

export interface Customer {
    id: string
    millId: string
    name: string
    phone: string
    email?: string
    address: string
    city: string
    state: string
    pincode: string
    gstNumber?: string
    customerType: CustomerType
    creditLimit: number
    currentBalance: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface Farmer {
    id: string
    millId: string
    name: string
    phone: string
    address: string
    village: string
    taluka: string
    district: string
    state: string
    aadharNumber?: string
    bankAccountNumber?: string
    bankIfscCode?: string
    totalPurchases: number
    pendingPayments: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// ==========================================
// Staff Types
// ==========================================

export type StaffRole =
    | 'manager'
    | 'operator'
    | 'accountant'
    | 'gate-keeper'
    | 'driver'
    | 'labor'

export interface Staff {
    id: string
    millId: string
    userId?: string // If staff has login access
    name: string
    phone: string
    email?: string
    role: StaffRole
    salary: number
    joiningDate: string
    address: string
    aadharNumber?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface AttendanceRecord {
    id: string
    staffId: string
    date: string
    checkIn?: string
    checkOut?: string
    status: 'present' | 'absent' | 'half-day' | 'leave'
    notes?: string
    createdAt: string
}

// ==========================================
// Report Types
// ==========================================

export interface DashboardStats {
    totalRevenue: number
    revenueGrowth: number
    totalPurchases: number
    purchasesGrowth: number
    totalSales: number
    salesGrowth: number
    inventoryValue: number
    inventoryGrowth: number
}

export interface ChartDataPoint {
    label: string
    value: number
    previousValue?: number
}

export interface ReportFilters {
    startDate: string
    endDate: string
    millId?: string
    stockType?: StockType
    status?: string
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

export interface PaginatedResponse<T> {
    success: boolean
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface ApiError {
    success: false
    error: {
        code: string
        message: string
        details?: Record<string, string[]>
    }
}

// ==========================================
// Subscription Types
// ==========================================

export interface Subscription {
    id: string
    millId: string
    plan: SubscriptionPlan
    status: 'active' | 'expired' | 'cancelled' | 'trial'
    startDate: string
    endDate: string
    amount: number
    paymentMethod?: string
    autoRenew: boolean
    createdAt: string
    updatedAt: string
}

export interface PricingPlan {
    id: string
    name: string
    slug: SubscriptionPlan
    description: string
    price: number
    billingCycle: 'monthly' | 'yearly'
    features: string[]
    limits: {
        maxStaff: number
        maxCustomers: number
        maxFarmers: number
        maxStorageGB: number
    }
    isPopular: boolean
}
