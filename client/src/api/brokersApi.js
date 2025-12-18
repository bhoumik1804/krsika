/**
 * API service for broker-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_BROKERS = [
    {
        _id: '1',
        brokerName: 'Rajesh Broker Services',
        phone: '+919876543210',
        email: 'rajesh.broker@example.com',
        commission: '2.5',
        address: 'Shop 15, Market Road, Delhi',
        city: 'Delhi',
        state: 'Delhi',
        createdAt: '2024-01-15T10:30:00.000Z',
    },
    {
        _id: '2',
        brokerName: 'Sharma & Associates',
        phone: '+919123456789',
        email: 'sharma.brokers@example.com',
        commission: '3.0',
        address: 'Office 201, Commercial Complex, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        createdAt: '2024-02-20T14:15:00.000Z',
    },
    {
        _id: '3',
        brokerName: 'Kumar Trading House',
        phone: '+919988776655',
        email: 'kumar.trading@example.com',
        commission: '2.0',
        address: 'Plot 45, Business Park, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        createdAt: '2024-03-10T09:45:00.000Z',
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_BROKERS.slice(startIndex, endIndex);
    const total = DUMMY_BROKERS.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Brokers retrieved successfully (DUMMY DATA)',
        data: {
            brokers: paginatedData,
            totalBrokers: total,
            pageSize,
            currentPage: page,
            totalPages,
            hasPrev: page > 1,
            hasNext: page < totalPages,
        },
    };
};

export const fetchBrokers = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };

    filters.forEach(filter => {
        if (filter.value) params[`filter[${filter.id}]`] = filter.value;
    });

    if (sorting.length > 0) {
        params.sortBy = sorting[0].id;
        params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    try {
        const data = await apiClient.get('/brokers', { params });
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export default { fetchBrokers };
