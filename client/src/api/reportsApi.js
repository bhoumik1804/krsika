/**
 * Combined API services for all report endpoints
 * This file contains all remaining API services to reduce file count
 */
import apiClient from '@/lib/apiClient';

// ============= BROKERS API =============
const DUMMY_BROKERS = [
    { _id: '1', brokerName: 'Rajesh Broker Services', phone: '+919876543210', email: 'rajesh.broker@example.com', commission: '2.5', address: 'Market Road, Delhi', createdAt: '2024-01-15T10:30:00.000Z' },
    { _id: '2', brokerName: 'Sharma & Associates', phone: '+919123456789', email: 'sharma.brokers@example.com', commission: '3.0', address: 'Commercial Complex, Mumbai', createdAt: '2024-02-20T14:15:00.000Z' },
];

// ============= COMMITTEE MEMBERS API =============
const DUMMY_COMMITTEE = [
    { _id: '1', memberName: 'Dr. Ramesh Kumar', position: 'Chairman', phone: '+919876543210', email: 'ramesh.kumar@example.com', joiningDate: '2023-01-01', createdAt: '2024-01-15T10:30:00.000Z' },
    { _id: '2', memberName: 'Mrs. Priya Sharma', position: 'Secretary', phone: '+919123456789', email: 'priya.sharma@example.com', joiningDate: '2023-06-15', createdAt: '2024-02-20T14:15:00.000Z' },
];

// ============= DO ENTRIES API =============
const DUMMY_DO_ENTRIES = [
    { _id: '1', doNumber: 'DO-2024-001', partyName: 'Xyz', date: '2024-01-15', quantity: '500', status: 'pending', createdAt: '2024-01-15T10:30:00.000Z' },
    { _id: '2', doNumber: 'DO-2024-002', partyName: 'Ram Janki', date: '2024-02-20', quantity: '750', status: 'completed', createdAt: '2024-02-20T14:15:00.000Z' },
];

// ============= REMAINING DO API =============
const DUMMY_REMAINING_DO = [
    { _id: '1', doNumber: 'DO-2024-003', partyName: 'PARTY 1', totalQuantity: '1000', liftedQuantity: '400', remainingQuantity: '600', dueDate: '2024-12-31', createdAt: '2024-03-15T10:30:00.000Z' },
];

// ============= PURCHASE DEALS API =============
const DUMMY_PADDY_PURCHASES = [
    { _id: '1', dealNumber: 'PD-2024-001', partyName: 'Xyz', dealDate: '2024-01-15', quantity: '500', rate: '2500', totalAmount: 1250000, status: 'active', createdAt: '2024-01-15T10:30:00.000Z' },
];

const DUMMY_RICE_PURCHASES = [
    { _id: '1', dealNumber: 'RD-2024-001', partyName: 'Ram Janki', dealDate: '2024-02-10', quantity: '300', rate: '4000', totalAmount: 1200000, status: 'active', createdAt: '2024-02-10T10:30:00.000Z' },
];

// ============= SALES DEALS API =============
const DUMMY_PADDY_SALES = [
    { _id: '1', dealNumber: 'PS-2024-001', partyName: 'PARTY 3', dealDate: '2024-03-15', quantity: '400', rate: '2800', totalAmount: 1120000, status: 'completed', createdAt: '2024-03-15T10:30:00.000Z' },
];

// ============= INWARD API =============
const DUMMY_PADDY_INWARD = [
    { _id: '1', inwardNumber: 'IN-P-001', partyName: 'Xyz', inwardDate: '2024-01-20', vehicleNumber: 'MH12AB1234', quantity: '500', transporterName: 'Swift Logistics', createdAt: '2024-01-20T10:30:00.000Z' },
];

const DUMMY_PRIVATE_INWARD = [
    { _id: '1', inwardNumber: 'IN-PR-001', partyName: 'Ram Janki', inwardDate: '2024-02-15', vehicleNumber: 'UP16CD5678', quantity: '300', transporterName: 'Rama Transport', createdAt: '2024-02-15T10:30:00.000Z' },
];

const DUMMY_RICE_INWARD = [
    { _id: '1', inwardNumber: 'IN-R-001', lotNumber: 'LOT-2024-001', partyName: 'PARTY 1', inwardDate: '2024-03-10', vehicleNumber: 'DL10EF9012', quantity: '200', transporterName: 'Krishna Cargo', createdAt: '2024-03-10T10:30:00.000Z' },
];

// Generic response generator
const generateResponse = (dataArray, dataKey, page = 1, pageSize = 10) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = dataArray.slice(startIndex, endIndex);
    const total = dataArray.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: `${dataKey} retrieved successfully (DUMMY DATA)`,
        data: {
            [dataKey]: paginatedData,
            [`total${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}`]: total,
            pageSize, currentPage: page, totalPages,
            hasPrev: page > 1, hasNext: page < totalPages,
        },
    };
};

// Generic fetch function
const createFetchFunction = (endpoint, dummyData, dataKey) => async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get(endpoint, { params });
    } catch (error) {
        console.warn(`⚠️ ${endpoint} API not available, using dummy data`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateResponse(dummyData, dataKey, page, pageSize);
    }
};

// Export all fetch functions
export const fetchBrokers = createFetchFunction('/brokers', DUMMY_BROKERS, 'brokers');
export const fetchCommittee = createFetchFunction('/committee', DUMMY_COMMITTEE, 'committeeMembers');
export const fetchDOEntries = createFetchFunction('/do-entries', DUMMY_DO_ENTRIES, 'doEntries');
export const fetchRemainingDO = createFetchFunction('/remaining-do', DUMMY_REMAINING_DO, 'remainingDOs');
export const fetchPaddyPurchases = createFetchFunction('/purchases/paddy', DUMMY_PADDY_PURCHASES, 'paddyPurchases');
export const fetchRicePurchases = createFetchFunction('/purchases/rice', DUMMY_RICE_PURCHASES, 'ricePurchases');
export const fetchPaddySales = createFetchFunction('/sales/paddy', DUMMY_PADDY_SALES, 'paddySales');
export const fetchPaddyInward = createFetchFunction('/inward/paddy', DUMMY_PADDY_INWARD, 'paddyInward');
export const fetchPrivateInward = createFetchFunction('/inward/private', DUMMY_PRIVATE_INWARD, 'privateInward');
export const fetchRiceInward = createFetchFunction('/inward/rice', DUMMY_RICE_INWARD, 'riceInward');

export default {
    fetchBrokers, fetchCommittee, fetchDOEntries, fetchRemainingDO,
    fetchPaddyPurchases, fetchRicePurchases, fetchPaddySales,
    fetchPaddyInward, fetchPrivateInward, fetchRiceInward,
};
