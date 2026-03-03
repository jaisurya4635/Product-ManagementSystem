// ========================
// Product Types
// ========================

export interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    createdAt: string;
}

export interface CreateProductPayload {
    name: string;
    price: number;
    stock: number;
}

export interface UpdateProductPayload {
    name?: string;
    price?: number;
    stock?: number;
}

// ========================
// API Response Types
// ========================

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message: string;
}

export interface PaginatedApiResponse<T = any> {
    success: boolean;
    data: T[];
    message: string;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ========================
// Query Params
// ========================

export interface ProductQueryParams {
    page: number;
    limit: number;
    search: string;
    sort: string;
    order: 'asc' | 'desc';
    minPrice?: string;
    maxPrice?: string;
    minStock?: string;
    maxStock?: string;
    recentlyAdded?: boolean;
}

export interface DashboardStats {
    totalProducts: number;
    totalInventoryValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    stockDistribution: {
        outOfStock: number;
        lowStock: number;
        inStock: number;
    };
    productsAddedPerMonth: { month: string; count: number }[];
}

// ========================
// Form Validation
// ========================

export interface FormErrors {
    name?: string;
    price?: string;
    stock?: string;
}
