/**
 * API service for private paddy inward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PRIVATE_INWARD = [
    { _id: '1', inwardNumber: 'IN-PR-001', partyName: 'Ram Janki', inwardDate: '2024-02-15', vehicleNumber: 'UP16CD5678', quantity: '300', transporterName: 'Rama Transport', createdAt: '2024-02-15T10:30:00.000Z' },
    { _id: '2', inwardNumber: 'IN-PR-002', partyName: 'sarguni industries', inwardDate: '2024-03-10', vehicleNumber: 'DL10EF9012', quantity: '450', transporterName: 'Krishna Cargo', createdAt: '2024-03-10T10:30:00.000Z' },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_PRIVATE_INWARD.slice(startIndex, endIndex);
    const total = DUMMY_PRIVATE_INWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Private inward retrieved successfully (DUMMY DATA)',
        data: { privateInward: paginatedData, totalPrivateInward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchPrivateInward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/inward/private', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createPrivatePaddyInward = async (inwardData) => {
    try {
        const data = await apiClient.post('/inward/paddy/private', inwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Private Paddy Inward created successfully (SIMULATED)',
            data: { ...inwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchPrivateInward, createPrivatePaddyInward };
