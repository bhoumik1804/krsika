"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  fetchFRKPurchases,
  createFRKPurchase,
  updateFRKPurchase,
  deleteFRKPurchase,
} from "../api/frkPurchasesApi";

export const useFRKPurchases = () => {
  const { pageIndex, pageSize, columnFilters, sorting } = useSelector(
    (state) => state.table
  );
  const page = pageIndex + 1;

  const query = useQuery({
    queryKey: ["frkPurchases", page, pageSize, columnFilters, sorting],
    queryFn: () =>
      fetchFRKPurchases({ page, pageSize, filters: columnFilters, sorting }),
    keepPreviousData: true,
    staleTime: 30000,
  });

  return {
    ...query,
    frkPurchases: query.data?.data?.frkPurchases || [],
    totalFRKPurchases: query.data?.data?.totalFRKPurchases || 0,
    totalPages: query.data?.data?.totalPages || 0,
    currentPage: query.data?.data?.currentPage || 1,
    hasNext: query.data?.data?.hasNext || false,
    hasPrev: query.data?.data?.hasPrev || false,
  };
};

export const useCreateFRKPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFRKPurchase,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["frkPurchases"] }),
  });
};

export const useUpdateFRKPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFRKPurchase,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["frkPurchases"] }),
  });
};

export const useDeleteFRKPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFRKPurchase,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["frkPurchases"] }),
  });
};

export default useFRKPurchases;
