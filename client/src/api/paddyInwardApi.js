/**
 * API service for paddy inward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PADDY_INWARD = [
    { _id: '1', inwardNumber: 'IN-P-001', partyName: 'Xyz', inwardDate: '2024-01-20', vehicleNumber: 'MH12AB1234', quantity: '500', transporterName: 'Swift Logistics', createdAt: '2024-01-20T10:30:00.000Z' },
    { _id: '2', inwardNumber: 'IN-P-002', partyName: 'Ram Janki', inwardDate: '2024-02-15', vehicleNumber: 'UP16CD5678', quantity: '600', transporterName: 'Rama Transport', createdAt: '2024-02-15T10:30:00.000Z' },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_PADDY_INWARD.slice(startIndex, endIndex);
    const total = DUMMY_PADDY_INWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Paddy inward retrieved successfully (DUMMY DATA)',
        data: { paddyInward: paginatedData, totalPaddyInward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchPaddyInward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/inward/paddy', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export default { fetchPaddyInward };
