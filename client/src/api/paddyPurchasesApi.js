/**
 * API service for paddy purchase deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PADDY_PURCHASES = [
    { _id: '1', dealNumber: 'PD-2024-001', partyName: 'Xyz', dealDate: '2024-01-15', quantity: '500', rate: '2500', totalAmount: 1250000, status: 'active', createdAt: '2024-01-15T10:30:00.000Z' },
    { _id: '2', dealNumber: 'PD-2024-002', partyName: 'Ram Janki', dealDate: '2024-02-10', quantity: '750', rate: '2600', totalAmount: 1950000, status: 'completed', createdAt: '2024-02-10T10:30:00.000Z' },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_PADDY_PURCHASES.slice(startIndex, endIndex);
    const total = DUMMY_PADDY_PURCHASES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Paddy purchases retrieved successfully (DUMMY DATA)',
        data: { paddyPurchases: paginatedData, totalPaddyPurchases: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchPaddyPurchases = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/purchases/paddy', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createPaddyPurchase = async (purchaseData) => {
    try {
        const data = await apiClient.post('/purchases/paddy', purchaseData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Paddy Purchase created successfully (SIMULATED)',
            data: { ...purchaseData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchPaddyPurchases, createPaddyPurchase };
