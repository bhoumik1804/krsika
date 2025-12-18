"use client";

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPaddyPurchases } from '../api/paddyPurchasesApi';

export const usePaddyPurchases = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['paddyPurchases', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPaddyPurchases({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        paddyPurchases: query.data?.data?.paddyPurchases || [],
        totalPaddyPurchases: query.data?.data?.totalPaddyPurchases || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export default usePaddyPurchases;
