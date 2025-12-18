"use client";

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPrivateInward } from '../api/privateInwardApi';

export const usePrivateInward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['privateInward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPrivateInward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        privateInward: query.data?.data?.privateInward || [],
        totalPrivateInward: query.data?.data?.totalPrivateInward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export default usePrivateInward;
