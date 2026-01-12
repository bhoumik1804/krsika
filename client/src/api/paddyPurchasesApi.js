/**
 * API service for paddy purchase deal-related endpoints
 */
import apiClient from "@/lib/apiClient";

export const fetchAllPaddyPurchases = async () => {
  try {
    const response = await apiClient.get("/purchases/paddy/all");
    return response?.data;
  } catch (error) {
    console.warn("⚠️ API not available, using dummy data");
    return error;
  }
};

export const fetchPaddyPurchases = async ({
  page = 1,
  pageSize = 10,
  filters = [],
  sorting = [],
}) => {
  const params = { page: page.toString(), pageSize: pageSize.toString() };
  filters.forEach((filter) => {
    if (filter.value) params[`filter[${filter.id}]`] = filter.value;
  });
  if (sorting.length > 0) {
    params.sortBy = sorting[0].id;
    params.sortOrder = sorting[0].desc ? "desc" : "asc";
  }

  try {
    return await apiClient.get("/purchases/paddy", { params });
  } catch (error) {
    console.warn("⚠️ API not available, using dummy data");
    return error;
  }
};

export const createPaddyPurchase = async (purchaseData) => {
  try {
    const data = await apiClient.post("/purchases/paddy", purchaseData);
    return data;
  } catch (error) {
    console.warn("⚠️ API not available, simulating create:", error.message);
    return error;
  }
};

export const deletePaddyPurchase = async (id) => {
  try {
    const data = await apiClient.delete(`/purchases/paddy/${id}`);
    return data;
  } catch (error) {
    console.warn("⚠️ API not available, simulating delete:", error.message);
    return error;
  }
};

export default {
  fetchPaddyPurchases,
  fetchAllPaddyPurchases,
  createPaddyPurchase,
  deletePaddyPurchase,
};
