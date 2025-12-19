"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPaddyInward, createGovPaddyInward } from '../api/paddyInwardApi';

export const usePaddyInward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['paddyInward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPaddyInward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        paddyInward: query.data?.data?.paddyInward || [],
        totalPaddyInward: query.data?.data?.totalPaddyInward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateGovPaddyInward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createGovPaddyInward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paddyInward'] }),
    });
};

export default usePaddyInward;
