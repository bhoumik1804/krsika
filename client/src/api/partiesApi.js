/**
 * API service for party-related endpoints
 */
import apiClient from '@/lib/apiClient';

// Dummy data for development/testing when API is not available
const DUMMY_PARTIES = [
    {
        _id: '1',
        partyName: 'Xyz',
        phone: '+919894397029',
        email: 'xyz@example.com',
        address: 'Quzi',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        gstn: '',
        createdAt: '2024-01-15T10:30:00.000Z',
    },
    {
        _id: '2',
        partyName: 'Ram Janki',
        phone: '+919990759995',
        email: 'ram.janki@example.com',
        address: 'utai',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        postalCode: '226001',
        country: 'India',
        gstn: '09ABCDE1234F1Z5',
        createdAt: '2024-02-20T14:15:00.000Z',
    },
    {
        _id: '3',
        partyName: 'sarguni industries',
        phone: '+919188398154',
        email: 'sarguni@example.com',
        address: 'utai, india',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        postalCode: '221001',
        country: 'India',
        gstn: '09XYZHG5678K1L9',
        createdAt: '2024-01-10T09:45:00.000Z',
    },
    {
        _id: '4',
        partyName: 'PARTY 3',
        phone: '+919876543210',
        email: 'party3@example.com',
        address: '123 Business District',
        city: 'Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India',
        gstn: '07MNOPQ9876R1S2',
        createdAt: '2024-03-05T11:20:00.000Z',
    },
    {
        _id: '5',
        partyName: 'PARTY 2',
        phone: '+919123456789',
        email: 'party2@example.com',
        address: '456 Market Road',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
        country: 'India',
        gstn: '27PQRST4321U1V3',
        createdAt: '2024-04-12T08:30:00.000Z',
    },
    {
        _id: '6',
        partyName: 'PARTY 1',
        phone: '+919998887776',
        email: 'party1@example.com',
        address: '789 Industrial Area',
        city: 'Ahmedabad',
        state: 'Gujarat',
        postalCode: '380001',
        country: 'India',
        gstn: '24UVWXY6543Z1A4',
        createdAt: '2024-02-28T16:00:00.000Z',
    },
    {
        _id: '7',
        partyName: 'Krishna Traders',
        phone: '+919555444333',
        email: 'krishna.traders@example.com',
        address: 'Shop No 12, Main Market',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302001',
        country: 'India',
        gstn: '08BCDEF7890G1H5',
        createdAt: '2024-03-15T13:45:00.000Z',
    },
    {
        _id: '8',
        partyName: 'Shiva Enterprises',
        phone: '+919444333222',
        email: 'shiva.ent@example.com',
        address: 'Plot 45, GIDC Estate',
        city: 'Surat',
        state: 'Gujarat',
        postalCode: '395001',
        country: 'India',
        gstn: '24GHIJK1234L1M6',
        createdAt: '2024-01-25T10:15:00.000Z',
    },
];

/**
 * Generate dummy response based on pagination params
 */
const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedParties = DUMMY_PARTIES.slice(startIndex, endIndex);
    const totalParties = DUMMY_PARTIES.length;
    const totalPages = Math.ceil(totalParties / pageSize);

    return {
        success: true,
        message: 'Parties retrieved successfully (DUMMY DATA)',
        data: {
            parties: paginatedParties,
            totalParties,
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
 * Fetch parties with pagination, filtering, and sorting
 * Falls back to dummy data if API is not available
 * @param {Object} params - Query parameters
 * @param {number} params.page - Current page (1-indexed)
 * @param {number} params.pageSize - Number of items per page
 * @param {Array} params.filters - Column filters array
 * @param {Array} params.sorting - Sorting configuration
 * @returns {Promise} API response with party data
 */
export const fetchParties = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
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
        const data = await apiClient.get('/parties', { params });
        return data;
    } catch (error) {
        // If API fails, return dummy data
        console.warn('⚠️ API not available, using dummy data:', error.message);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return generateDummyResponse({ page, pageSize });
    }
};

/**
 * Create a new party
 * @param {Object} partyData - Party data to create
 * @returns {Promise} API response
 */
export const createParty = async (partyData) => {
    try {
        const data = await apiClient.post('/parties', partyData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Party created successfully (SIMULATED)',
            data: { ...partyData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

/**
 * Update an existing party
 * @param {string} id - Party ID
 * @param {Object} partyData - Updated party data
 * @returns {Promise} API response
 */
export const updateParty = async (id, partyData) => {
    try {
        const data = await apiClient.put(`/parties/${id}`, partyData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating update:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Party updated successfully (SIMULATED)',
            data: { ...partyData, _id: id, updatedAt: new Date().toISOString() },
        };
    }
};

/**
 * Delete a party
 * @param {string} id - Party ID
 * @returns {Promise} API response
 */
export const deleteParty = async (id) => {
    try {
        const data = await apiClient.delete(`/parties/${id}`);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating delete:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Party deleted successfully (SIMULATED)',
        };
    }
};

export default {
    fetchParties,
    createParty,
    updateParty,
    deleteParty,
};
