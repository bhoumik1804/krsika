"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPaddySales, createPaddySale } from '../api/paddySalesApi';

export const usePaddySales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['paddySales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPaddySales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        paddySales: query.data?.data?.paddySales || [],
        totalPaddySales: query.data?.data?.totalPaddySales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreatePaddySale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaddySale,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paddySales'] }),
    });
};

export default usePaddySales;
