"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchRiceInward, createRiceInward } from '../api/riceInwardApi';

export const useRiceInward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['riceInward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchRiceInward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        riceInward: query.data?.data?.riceInward || [],
        totalRiceInward: query.data?.data?.totalRiceInward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateRiceInward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRiceInward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['riceInward'] }),
    });
};

export default useRiceInward;
