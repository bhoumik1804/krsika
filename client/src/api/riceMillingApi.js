/**
 * API service for rice milling-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_RICE_MILLING = [
    {
        _id: '1',
        date: '2024-03-10',
        riceType: 'चावल (पतला)',
        hopperGunny: '100',
        hopperQtl: '50',
        riceQty: '45',
        ricePercent: '90',
        khandaQty: '2',
        khandaPercent: '4',
        silkyKodhaQty: '1.5',
        silkyKodhaPercent: '3',
        wastagePercent: '3',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_RICE_MILLING.slice(startIndex, endIndex);
    const total = DUMMY_RICE_MILLING.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Rice milling retrieved successfully (DUMMY DATA)',
        data: { riceMilling: paginatedData, totalRiceMilling: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchRiceMilling = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/milling/rice', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createRiceMilling = async (millingData) => {
    try {
        const data = await apiClient.post('/milling/rice', millingData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Rice Milling created successfully (SIMULATED)',
            data: { ...millingData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchRiceMilling, createRiceMilling };
