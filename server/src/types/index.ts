// ========================
// Product Types
// ========================

export interface IProduct {
    _id: string;
    name: string;
    price: number;
    stock: number;
    createdAt: Date;
}

export interface CreateProductDTO {
    name: string;
    price: number;
    stock: number;
}

export interface UpdateProductDTO {
    name?: string;
    price?: number;
    stock?: number;
}

// ========================
// Query Types
// ========================

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
    recentlyAdded?: boolean;
}

export interface BulkDeleteDTO {
    ids: string[];
}

export interface BulkUpdateStockDTO {
    ids: string[];
    stock: number;
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
// API Response Types
// ========================

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message: string;
}

export interface PaginatedResponse<T = any> {
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
// Error Types
// ========================

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
