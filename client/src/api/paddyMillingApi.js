/**
 * API service for paddy milling-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PADDY_MILLING = [
    {
        _id: '1',
        date: '2024-03-10',
        paddyType: 'धान(मोटा)',
        hopperGunny: '100',
        hopperQtl: '50',
        riceType: 'चावल (मोटा)',
        riceQty: '32.5',
        ricePercent: '65',
        khandaQty: '2.5',
        khandaPercent: '5',
        kodhaQty: '3',
        kodhaPercent: '6',
        bhusaTon: '5',
        bhusaPercent: '10',
        nakkhiQty: '1.5',
        nakkhiPercent: '3',
        wastagePercent: '11',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_PADDY_MILLING.slice(startIndex, endIndex);
    const total = DUMMY_PADDY_MILLING.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Paddy milling retrieved successfully (DUMMY DATA)',
        data: { paddyMilling: paginatedData, totalPaddyMilling: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchPaddyMilling = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/milling/paddy', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createPaddyMilling = async (millingData) => {
    try {
        const data = await apiClient.post('/milling/paddy', millingData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Paddy Milling created successfully (SIMULATED)',
            data: { ...millingData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchPaddyMilling, createPaddyMilling };
