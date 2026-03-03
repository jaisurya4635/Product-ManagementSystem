import { useState, useEffect, useCallback, useRef } from 'react';
import productApi from '../api/productApi';
import type {
    Product,
    CreateProductPayload,
    UpdateProductPayload,
    ProductQueryParams,
} from '../types/product';
import { useDebounce } from './useDebounce';

export interface Filters {
    minPrice: string;
    maxPrice: string;
    minStock: string;
    maxStock: string;
    recentlyAdded: boolean;
}

const defaultFilters: Filters = {
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    recentlyAdded: false,
};

interface UseProductsReturn {
    products: Product[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    search: string;
    sort: string;
    order: 'asc' | 'desc';
    filters: Filters;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    setSort: (sort: string) => void;
    toggleOrder: () => void;
    setFilters: (filters: Filters) => void;
    resetFilters: () => void;
    addProduct: (payload: CreateProductPayload) => Promise<void>;
    updateProduct: (id: string, payload: UpdateProductPayload) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    bulkDelete: (ids: string[]) => Promise<void>;
    bulkUpdateStock: (ids: string[], stock: number) => Promise<void>;
    refetch: () => void;
}

export function useProducts(initialLimit: number = 10): UseProductsReturn {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');
    const [sort, setSort] = useState<string>('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: initialLimit,
        total: 0,
        totalPages: 0,
    });

    const debouncedSearch = useDebounce(search, 300);

    // Debounce filter values as a JSON string so useDebounce compares primitives (not object refs)
    const filtersJson = JSON.stringify(filters);
    const debouncedFiltersJson = useDebounce(filtersJson, 300);
    const debouncedFilters: Filters = JSON.parse(debouncedFiltersJson);

    // Stable primitive key for dependency tracking
    const filtersKey = debouncedFiltersJson;

    // Request cancellation: only the latest request's response is applied
    const fetchIdRef = useRef(0);

    const fetchProducts = useCallback(async (silent = false) => {
        const currentId = ++fetchIdRef.current;

        try {
            if (!silent) setLoading(true);
            setError(null);

            const params: ProductQueryParams = {
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch,
                sort,
                order,
                minPrice: debouncedFilters.minPrice !== '' ? Number(debouncedFilters.minPrice) : undefined,
                maxPrice: debouncedFilters.maxPrice !== '' ? Number(debouncedFilters.maxPrice) : undefined,
                minStock: debouncedFilters.minStock !== '' ? Number(debouncedFilters.minStock) : undefined,
                maxStock: debouncedFilters.maxStock !== '' ? Number(debouncedFilters.maxStock) : undefined,
                recentlyAdded: debouncedFilters.recentlyAdded || undefined,
            };

            const response = await productApi.getProducts(params);

            // Discard stale responses
            if (currentId !== fetchIdRef.current) return;

            if (response.success) {
                setProducts(response.data);
                setPagination((prev) => ({
                    ...prev,
                    total: response.pagination.total,
                    totalPages: response.pagination.totalPages,
                }));
            }
        } catch (err: any) {
            if (currentId !== fetchIdRef.current) return;
            const message =
                err.response?.data?.message || err.message || 'Failed to fetch products';
            setError(message);
        } finally {
            if (currentId === fetchIdRef.current) {
                if (!silent) setLoading(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.limit, debouncedSearch, sort, order, filtersKey]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset to page 1 when search/sort/filters change
    useEffect(() => {
        setPagination((prev) => {
            if (prev.page === 1) return prev; // Bail out — no re-render if already page 1
            return { ...prev, page: 1 };
        });
    }, [debouncedSearch, sort, order, filtersKey]);

    const setPage = useCallback((page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    }, []);

    const toggleOrder = useCallback(() => {
        setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
        setSearch('');
        setSort('createdAt');
        setOrder('desc');
    }, []);

    const addProduct = useCallback(
        async (payload: CreateProductPayload) => {
            const response = await productApi.createProduct(payload);
            if (response.success) {
                await fetchProducts(true);
            } else {
                throw new Error(response.message);
            }
        },
        [fetchProducts]
    );

    const updateProduct = useCallback(
        async (id: string, payload: UpdateProductPayload) => {
            // Optimistic update
            setProducts((prev) =>
                prev.map((p) =>
                    p._id === id ? { ...p, ...payload } : p
                )
            );

            try {
                const response = await productApi.updateProduct(id, payload);
                if (response.success) {
                    setProducts((prev) =>
                        prev.map((p) => (p._id === id ? response.data : p))
                    );
                } else {
                    throw new Error(response.message);
                }
            } catch (err) {
                await fetchProducts(true);
                throw err;
            }
        },
        [fetchProducts]
    );

    const deleteProduct = useCallback(
        async (id: string) => {
            const previousProducts = [...products];
            setProducts((prev) => prev.filter((p) => p._id !== id));

            try {
                const response = await productApi.deleteProduct(id);
                if (response.success) {
                    await fetchProducts(true);
                } else {
                    throw new Error(response.message);
                }
            } catch (err) {
                setProducts(previousProducts);
                throw err;
            }
        },
        [products, fetchProducts]
    );

    const bulkDelete = useCallback(
        async (ids: string[]) => {
            const response = await productApi.bulkDelete(ids);
            if (response.success) {
                await fetchProducts(true);
            } else {
                throw new Error(response.message);
            }
        },
        [fetchProducts]
    );

    const bulkUpdateStock = useCallback(
        async (ids: string[], stock: number) => {
            const response = await productApi.bulkUpdateStock(ids, stock);
            if (response.success) {
                await fetchProducts(true);
            } else {
                throw new Error(response.message);
            }
        },
        [fetchProducts]
    );

    return {
        products,
        loading,
        error,
        pagination,
        search,
        sort,
        order,
        filters,
        setSearch,
        setPage,
        setSort,
        toggleOrder,
        setFilters,
        resetFilters,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkDelete,
        bulkUpdateStock,
        refetch: () => fetchProducts(),
    };
}
