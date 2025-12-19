"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchTransporters, createTransporter, updateTransporter, deleteTransporter } from '../api/transportersApi';

export const useTransporters = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['transporters', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchTransporters({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        transporters: query.data?.data?.transporters || [],
        totalTransporters: query.data?.data?.totalTransporters || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateTransporter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTransporter,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transporters'] }),
    });
};

export const useUpdateTransporter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateTransporter(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transporters'] }),
    });
};

export const useDeleteTransporter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTransporter,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transporters'] }),
    });
};

export default useTransporters;
