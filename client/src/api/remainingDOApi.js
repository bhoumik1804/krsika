/**
 * API service for remaining DO-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_REMAINING_DO = [
    { _id: '1', doNumber: 'DO-2024-003', partyName: 'PARTY 1', totalQuantity: '1000', liftedQuantity: '400', remainingQuantity: '600', dueDate: '2024-12-31', createdAt: '2024-03-15T10:30:00.000Z' },
    { _id: '2', doNumber: 'DO-2024-004', partyName: 'PARTY 2', totalQuantity: '800', liftedQuantity: '300', remainingQuantity: '500', dueDate: '2025-01-15', createdAt: '2024-04-10T10:30:00.000Z' },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_REMAINING_DO.slice(startIndex, endIndex);
    const total = DUMMY_REMAINING_DO.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Remaining DO retrieved successfully (DUMMY DATA)',
        data: { remainingDOs: paginatedData, totalRemainingDOs: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchRemainingDO = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/remaining-do', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export default { fetchRemainingDO };
