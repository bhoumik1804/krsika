import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchStudents } from '../api/studentsApi';

/**
 * React Query hook for fetching students with pagination
 * Uses Redux state for pagination parameters
 * @returns {Object} React Query result with students data, loading, and error states
 */
export const useStudents = () => {
    // Get table state from Redux
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);

    // Convert 0-indexed pageIndex to 1-indexed page for API
    const page = pageIndex + 1;

    // Use React Query to fetch and cache data
    const query = useQuery({
        queryKey: ['students', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchStudents({
            page,
            pageSize,
            filters: columnFilters,
            sorting,
        }),
        keepPreviousData: true, // Keep showing old data while fetching new data
        staleTime: 30000, // Consider data fresh for 30 seconds
    });

    return {
        ...query,
        students: query.data?.data?.students || [],
        totalStudents: query.data?.data?.totalStudents || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export default useStudents;
