"use client";

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchRemainingDO } from '../api/remainingDOApi';

export const useRemainingDO = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['remainingDO', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchRemainingDO({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        remainingDOs: query.data?.data?.remainingDOs || [],
        totalRemainingDOs: query.data?.data?.totalRemainingDOs || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export default useRemainingDO;
