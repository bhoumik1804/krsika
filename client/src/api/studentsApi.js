/**
 * API service for student-related endpoints
 */
import apiClient from '@/lib/apiClient';

// Dummy data for development/testing when API is not available
const DUMMY_STUDENTS = [
    {
        _id: '1',
        fullName: 'Raj Kumar Sharma',
        email: 'raj.sharma@example.com',
        courseName: 'B.Tech Computer Science',
        collegeName: 'IIT Delhi',
        yearOfStudy: '3',
        phoneNumber: '9876543210',
        createdAt: '2024-01-15T10:30:00.000Z',
    },
    {
        _id: '2',
        fullName: 'Priya Singh',
        email: 'priya.singh@example.com',
        courseName: 'MBA',
        collegeName: 'IIM Bangalore',
        yearOfStudy: '2',
        phoneNumber: '9876543211',
        createdAt: '2024-02-20T14:15:00.000Z',
    },
    {
        _id: '3',
        fullName: 'Amit Patel',
        email: 'amit.patel@example.com',
        courseName: 'B.Sc Agriculture',
        collegeName: 'Punjab Agricultural University',
        yearOfStudy: '4',
        phoneNumber: '9876543212',
        createdAt: '2024-01-10T09:45:00.000Z',
    },
    {
        _id: '4',
        fullName: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        courseName: 'B.Tech Mechanical',
        collegeName: 'NIT Trichy',
        yearOfStudy: '2',
        phoneNumber: '9876543213',
        createdAt: '2024-03-05T11:20:00.000Z',
    },
    {
        _id: '5',
        fullName: 'Vikram Malhotra',
        email: 'vikram.m@example.com',
        courseName: 'BBA',
        collegeName: 'Delhi University',
        yearOfStudy: '1',
        phoneNumber: '9876543214',
        createdAt: '2024-04-12T08:30:00.000Z',
    },
    {
        _id: '6',
        fullName: 'Ananya Gupta',
        email: 'ananya.gupta@example.com',
        courseName: 'B.Tech ECE',
        collegeName: 'BITS Pilani',
        yearOfStudy: '3',
        phoneNumber: '9876543215',
        createdAt: '2024-02-28T16:00:00.000Z',
    },
    {
        _id: '7',
        fullName: 'Rahul Verma',
        email: 'rahul.verma@example.com',
        courseName: 'M.Tech AI',
        collegeName: 'IIT Bombay',
        yearOfStudy: '1',
        phoneNumber: '9876543216',
        createdAt: '2024-03-15T13:45:00.000Z',
    },
    {
        _id: '8',
        fullName: 'Kavya Krishnan',
        email: 'kavya.k@example.com',
        courseName: 'B.Sc Horticulture',
        collegeName: 'Tamil Nadu Agricultural University',
        yearOfStudy: '2',
        phoneNumber: '9876543217',
        createdAt: '2024-01-25T10:15:00.000Z',
    },
    {
        _id: '9',
        fullName: 'Arjun Das',
        email: 'arjun.das@example.com',
        courseName: 'B.Tech Civil',
        collegeName: 'IIT Madras',
        yearOfStudy: '4',
        phoneNumber: '9876543218',
        createdAt: '2024-02-10T12:30:00.000Z',
    },
    {
        _id: '10',
        fullName: 'Pooja Nair',
        email: 'pooja.nair@example.com',
        courseName: 'MCA',
        collegeName: 'NIT Calicut',
        yearOfStudy: '2',
        phoneNumber: '9876543219',
        createdAt: '2024-03-20T15:00:00.000Z',
    },
];

/**
 * Generate dummy response based on pagination params
 */
const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedStudents = DUMMY_STUDENTS.slice(startIndex, endIndex);
    const totalStudents = DUMMY_STUDENTS.length;
    const totalPages = Math.ceil(totalStudents / pageSize);

    return {
        success: true,
        message: 'Student enrollments retrieved successfully (DUMMY DATA)',
        data: {
            students: paginatedStudents,
            totalStudents,
            pageSize,
            currentPage: page,
            totalPages,
            serialNo: startIndex + 1,
            hasPrev: page > 1,
            hasNext: page < totalPages,
            prev: page > 1 ? page - 1 : null,
            next: page < totalPages ? page + 1 : null,
        },
    };
};

/**
 * Fetch students with pagination, filtering, and sorting
 * Falls back to dummy data if API is not available
 * @param {Object} params - Query parameters
 * @param {number} params.page - Current page (1-indexed)
 * @param {number} params.pageSize - Number of items per page
 * @param {Array} params.filters - Column filters array
 * @param {Array} params.sorting - Sorting configuration
 * @returns {Promise} API response with student data
 */
export const fetchStudents = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
    };

    // Add filters to query params
    filters.forEach(filter => {
        if (filter.value) {
            params[`filter[${filter.id}]`] = filter.value;
        }
    });

    // Add sorting to query params
    if (sorting.length > 0) {
        params.sortBy = sorting[0].id;
        params.sortOrder = sorting[0].desc ? 'desc' : 'asc';
    }

    try {
        // Try to fetch from API
        const data = await apiClient.get('/students', { params });
        return data;
    } catch (error) {
        // If API fails, return dummy data
        console.warn('⚠️ API not available, using dummy data:', error.message);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return generateDummyResponse({ page, pageSize });
    }
};

export default {
    fetchStudents,
};
