import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';
import { ApiResponse, PaginatedResponse, AppError, DashboardStats } from '../types';

class ProductController {
    /**
     * POST /products — Create a new product
     */
    async createProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { name, price, stock } = req.body;
            const product = await productService.createProduct({ name, price, stock });

            const response: ApiResponse = {
                success: true,
                data: product,
                message: 'Product created successfully',
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /products — List products with pagination, search, sorting and filtering
     */
    async getProducts(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;
            const sort = (req.query.sort as string) || 'createdAt';
            const order = (req.query.order as 'asc' | 'desc') || 'desc';
            const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : undefined;
            const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined;
            const minStock = req.query.minStock !== undefined ? Number(req.query.minStock) : undefined;
            const maxStock = req.query.maxStock !== undefined ? Number(req.query.maxStock) : undefined;
            const recentlyAdded = req.query.recentlyAdded === 'true';

            const { products, total } = await productService.getProducts({
                page,
                limit,
                search,
                sort,
                order,
                minPrice,
                maxPrice,
                minStock,
                maxStock,
                recentlyAdded
            });

            const totalPages = Math.ceil(total / limit);

            const response: PaginatedResponse = {
                success: true,
                data: products,
                message: 'Products fetched successfully',
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /products/stats — Get Dashboard Analytics
     */
    async getAnalytics(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const stats = await productService.getAnalytics();
            res.status(200).json({
                success: true,
                data: stats,
                message: 'Analytics fetched successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /products/bulk-delete — Bulk delete products
     */
    async bulkDelete(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids)) {
                throw new AppError('IDs must be an array', 400);
            }
            const deletedCount = await productService.bulkDelete(ids);
            res.status(200).json({
                success: true,
                data: { deletedCount },
                message: `${deletedCount} products deleted successfully`
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /products/bulk-update-stock — Bulk update stock
     */
    async bulkUpdateStock(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { ids, stock } = req.body;
            if (!Array.isArray(ids)) {
                throw new AppError('IDs must be an array', 400);
            }
            if (typeof stock !== 'number') {
                throw new AppError('Stock must be a number', 400);
            }
            const updatedCount = await productService.bulkUpdateStock(ids, stock);
            res.status(200).json({
                success: true,
                data: { updatedCount },
                message: `${updatedCount} products updated successfully`
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /products/:id — Get single product
     */
    async getProductById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = req.params.id as string;
            const product = await productService.getProductById(id);

            const response: ApiResponse = {
                success: true,
                data: product,
                message: 'Product fetched successfully',
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /products/:id — Update product
     */
    async updateProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = req.params.id as string;
            const { name, price, stock } = req.body;
            const product = await productService.updateProduct(id, {
                name,
                price,
                stock,
            });

            const response: ApiResponse = {
                success: true,
                data: product,
                message: 'Product updated successfully',
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /products/:id — Delete product
     */
    async deleteProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = req.params.id as string;
            await productService.deleteProduct(id);

            const response: ApiResponse = {
                success: true,
                data: null,
                message: 'Product deleted successfully',
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();
