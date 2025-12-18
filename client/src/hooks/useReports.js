"use client";

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
    fetchBrokers, fetchCommittee, fetchDOEntries, fetchRemainingDO,
    fetchPaddyPurchases, fetchRicePurchases, fetchPaddySales,
    fetchPaddyInward, fetchPrivateInward, fetchRiceInward
} from '../api/reportsApi';

// Generic hook creator
const createUseHook = (queryKey, fetchFunction, dataKey) => () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: [queryKey, page, pageSize, columnFilters, sorting],
        queryFn: () => fetchFunction({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    const totalKey = `total${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}`;

    return {
        ...query,
        [dataKey]: query.data?.data?.[dataKey] || [],
        [totalKey]: query.data?.data?.[totalKey] || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

// Export all hooks
export const useBrokers = createUseHook('brokers', fetchBrokers, 'brokers');
export const useCommittee = createUseHook('committee', fetchCommittee, 'committeeMembers');
export const useDOEntries = createUseHook('doEntries', fetchDOEntries, 'doEntries');
export const useRemainingDO = createUseHook('remainingDO', fetchRemainingDO, 'remainingDOs');
export const usePaddyPurchases = createUseHook('paddyPurchases', fetchPaddyPurchases, 'paddyPurchases');
export const useRicePurchases = createUseHook('ricePurchases', fetchRicePurchases, 'ricePurchases');
export const usePaddySales = createUseHook('paddySales', fetchPaddySales, 'paddySales');
export const usePaddyInward = createUseHook('paddyInward', fetchPaddyInward, 'paddyInward');
export const usePrivateInward = createUseHook('privateInward', fetchPrivateInward, 'privateInward');
export const useRiceInward = createUseHook('riceInward', fetchRiceInward, 'riceInward');
