/**
 * API service for paddy sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PADDY_SALES = [
    { _id: '1', dealNumber: 'PS-2024-001', partyName: 'PARTY 3', dealDate: '2024-03-15', quantity: '400', rate: '2800', totalAmount: 1120000, status: 'completed', createdAt: '2024-03-15T10:30:00.000Z' },
    { _id: '2', dealNumber: 'PS-2024-002', partyName: 'PARTY 1', dealDate: '2024-04-01', quantity: '550', rate: '2900', totalAmount: 1595000, status: 'active', createdAt: '2024-04-01T10:30:00.000Z' },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_PADDY_SALES.slice(startIndex, endIndex);
    const total = DUMMY_PADDY_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Paddy sales retrieved successfully (DUMMY DATA)',
        data: { paddySales: paginatedData, totalPaddySales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchPaddySales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/paddy', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export default { fetchPaddySales };
