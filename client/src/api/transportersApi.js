/**
 * API service for transporter-related endpoints
 */
import apiClient from '@/lib/apiClient';

// Dummy data for development/testing
const DUMMY_TRANSPORTERS = [
    {
        _id: '1',
        transporterName: 'Swift Logistics Pvt Ltd',
        phone: '+919876543210',
        email: 'swift.logistics@example.com',
        vehicleNumber: 'MH12AB1234',
        address: 'Plot 12, Transport Nagar, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        createdAt: '2024-01-15T10:30:00.000Z',
    },
    {
        _id: '2',
        transporterName: 'Rama Transport Services',
        phone: '+919123456789',
        email: 'rama.transport@example.com',
        vehicleNumber: 'UP16CD5678',
        address: 'Transport Hub, Sector 63, Noida',
        city: 'Noida',
        state: 'Uttar Pradesh',
        createdAt: '2024-02-20T14:15:00.000Z',
    },
    {
        _id: '3',
        transporterName: 'Krishna Cargo Movers',
        phone: '+919988776655',
        email: 'krishna.cargo@example.com',
        vehicleNumber: 'DL10EF9012',
        address: 'Warehouse Complex, Delhi',
        city: 'Delhi',
        state: 'Delhi',
        createdAt: '2024-03-10T09:45:00.000Z',
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_TRANSPORTERS.slice(startIndex, endIndex);
    const total = DUMMY_TRANSPORTERS.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Transporters retrieved successfully (DUMMY DATA)',
        data: {
            transporters: paginatedData,
            totalTransporters: total,
            pageSize,
            currentPage: page,
            totalPages,
            hasPrev: page > 1,
            hasNext: page < totalPages,
        },
    };
};

export const fetchTransporters = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };

    filters.forEach(filter => {
        if (filter.value) params[`filter[${filter.id}]`] = filter.value;
    });

    if (sorting.length > 0) {
        params.sortBy = sorting[0].id;
        params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    try {
        const data = await apiClient.get('/transporters', { params });
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export default { fetchTransporters };
