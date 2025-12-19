/**
 * API service for rice inward/lot deposit-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_RICE_INWARD = [
    { _id: '1', inwardNumber: 'IN-R-001', lotNumber: 'LOT-2024-001', partyName: 'PARTY 1', inwardDate: '2024-03-10', vehicleNumber: 'DL10EF9012', quantity: '200', transporterName: 'Krishna Cargo', createdAt: '2024-03-10T10:30:00.000Z' },
    { _id: '2', inwardNumber: 'IN-R-002', lotNumber: 'LOT-2024-002', partyName: 'PARTY 2', inwardDate: '2024-04-05', vehicleNumber: 'MH12AB1234', quantity: '350', transporterName: 'Swift Logistics', createdAt: '2024-04-05T10:30:00.000Z' },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_RICE_INWARD.slice(startIndex, endIndex);
    const total = DUMMY_RICE_INWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Rice inward retrieved successfully (DUMMY DATA)',
        data: { riceInward: paginatedData, totalRiceInward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchRiceInward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/inward/rice', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createRiceInward = async (inwardData) => {
    try {
        const data = await apiClient.post('/inward/rice', inwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Rice Inward created successfully (SIMULATED)',
            data: { ...inwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchRiceInward, createRiceInward };
