"use client";

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchBrokers } from '../api/brokersApi';

export const useBrokers = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['brokers', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchBrokers({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        brokers: query.data?.data?.brokers || [],
        totalBrokers: query.data?.data?.totalBrokers || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export default useBrokers;
