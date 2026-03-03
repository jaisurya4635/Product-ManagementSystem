import axios from 'axios';
import type {
    Product,
    CreateProductPayload,
    UpdateProductPayload,
    ApiResponse,
    PaginatedApiResponse,
    ProductQueryParams,
    DashboardStats,
} from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productApi = {
    getProducts: async (
        params: ProductQueryParams
    ): Promise<PaginatedApiResponse<Product>> => {
        const { data } = await api.get<PaginatedApiResponse<Product>>('/products', {
            params: {
                page: params.page,
                limit: params.limit,
                search: params.search || undefined,
                sort: params.sort,
                order: params.order,
                minPrice: params.minPrice || undefined,
                maxPrice: params.maxPrice || undefined,
                minStock: params.minStock || undefined,
                maxStock: params.maxStock || undefined,
                recentlyAdded: params.recentlyAdded || undefined,
            },
        });
        return data;
    },

    createProduct: async (
        payload: CreateProductPayload
    ): Promise<ApiResponse<Product>> => {
        const { data } = await api.post<ApiResponse<Product>>('/products', payload);
        return data;
    },

    updateProduct: async (
        id: string,
        payload: UpdateProductPayload
    ): Promise<ApiResponse<Product>> => {
        const { data } = await api.put<ApiResponse<Product>>(
            `/products/${id}`,
            payload
        );
        return data;
    },

    deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
        const { data } = await api.delete<ApiResponse<null>>(`/products/${id}`);
        return data;
    },

    getStats: async (): Promise<ApiResponse<DashboardStats>> => {
        const { data } = await api.get<ApiResponse<DashboardStats>>('/products/stats');
        return data;
    },

    bulkDelete: async (ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> => {
        const { data } = await api.post<ApiResponse<{ deletedCount: number }>>('/products/bulk-delete', { ids });
        return data;
    },

    bulkUpdateStock: async (ids: string[], stock: number): Promise<ApiResponse<{ updatedCount: number }>> => {
        const { data } = await api.put<ApiResponse<{ updatedCount: number }>>('/products/bulk-update-stock', { ids, stock });
        return data;
    },
};

export default productApi;
