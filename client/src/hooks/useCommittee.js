"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchCommittee, createCommitteeMember } from '../api/committeeApi';

export const useCommittee = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['committee', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchCommittee({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        committeeMembers: query.data?.data?.committeeMembers || [],
        totalCommitteeMembers: query.data?.data?.totalCommitteeMembers || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateCommitteeMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCommitteeMember,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['committee'] }),
    });
};

export default useCommittee;
