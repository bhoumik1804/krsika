/**
 * API service for DO entry-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_DO_ENTRIES = [
    { _id: '1', doNumber: 'DO-2024-001', partyName: 'Xyz', date: '2024-01-15', quantity: '500', status: 'pending', createdAt: '2024-01-15T10:30:00.000Z' },
    { _id: '2', doNumber: 'DO-2024-002', partyName: 'Ram Janki', date: '2024-02-20', quantity: '750', status: 'completed', createdAt: '2024-02-20T14:15:00.000Z' },
    { _id: '3', doNumber: 'DO-2024-003', partyName: 'sarguni industries', date: '2024-03-10', quantity: '600', status: 'pending', createdAt: '2024-03-10T09:45:00.000Z' },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_DO_ENTRIES.slice(startIndex, endIndex);
    const total = DUMMY_DO_ENTRIES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'DO entries retrieved successfully (DUMMY DATA)',
        data: { doEntries: paginatedData, totalDoEntries: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchDOEntries = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/do-entries', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export default { fetchDOEntries };
