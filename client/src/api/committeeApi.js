/**
 * API service for committee member-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_COMMITTEE = [
    {
        _id: '1',
        memberName: 'Dr. Ramesh Kumar',
        position: 'Chairman',
        phone: '+919876543210',
        email: 'ramesh.kumar@example.com',
        joiningDate: '2023-01-01',
        createdAt: '2024-01-15T10:30:00.000Z',
    },
    {
        _id: '2',
        memberName: 'Mrs. Priya Sharma',
        position: 'Secretary',
        phone: '+919123456789',
        email: 'priya.sharma@example.com',
        joiningDate: '2023-06-15',
        createdAt: '2024-02-20T14:15:00.000Z',
    },
    {
        _id: '3',
        memberName: 'Mr. Vijay Patel',
        position: 'Treasurer',
        phone: '+919988776655',
        email: 'vijay.patel@example.com',
        joiningDate: '2023-03-20',
        createdAt: '2024-03-10T09:45:00.000Z',
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_COMMITTEE.slice(startIndex, endIndex);
    const total = DUMMY_COMMITTEE.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Committee members retrieved successfully (DUMMY DATA)',
        data: {
            committeeMembers: paginatedData,
            totalCommitteeMembers: total,
            pageSize,
            currentPage: page,
            totalPages,
            hasPrev: page > 1,
            hasNext: page < totalPages,
        },
    };
};

export const fetchCommittee = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };

    filters.forEach(filter => {
        if (filter.value) params[`filter[${filter.id}]`] = filter.value;
    });

    if (sorting.length > 0) {
        params.sortBy = sorting[0].id;
        params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    try {
        const data = await apiClient.get('/committee', { params });
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export default { fetchCommittee };
