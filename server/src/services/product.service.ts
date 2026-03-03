import Product, { IProductDocument } from '../models/product.model';
import { CreateProductDTO, UpdateProductDTO, AppError, ProductQueryParams, DashboardStats } from '../types';

class ProductService {
    /**
     * Create a new product
     */
    async createProduct(data: CreateProductDTO): Promise<IProductDocument> {
        this.validateProductData(data);

        const product = new Product({
            name: data.name.trim(),
            price: data.price,
            stock: data.stock,
        });

        return await product.save();
    }

    /**
     * Get all products with pagination, search, sorting and advanced filters
     */
    async getProducts(params: ProductQueryParams): Promise<{ products: IProductDocument[]; total: number }> {
        let { page = 1, limit = 10, search, sort = 'createdAt', order = 'desc', minPrice, maxPrice, minStock, maxStock, recentlyAdded } = params;

        // Validate pagination params
        page = Math.max(1, page);
        limit = Math.min(Math.max(1, limit), 100); // Cap at 100

        // Build query filter
        const filter: any = {};
        if (search && search.trim()) {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
        }

        if (minStock !== undefined || maxStock !== undefined) {
            filter.stock = {};
            if (minStock !== undefined) filter.stock.$gte = Number(minStock);
            if (maxStock !== undefined) filter.stock.$lte = Number(maxStock);
        }

        if (recentlyAdded === true || recentlyAdded === 'true' as any) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            filter.createdAt = { $gte: sevenDaysAgo };
        }

        // Validate sort field
        const allowedSortFields = ['name', 'price', 'stock', 'createdAt'];
        const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter),
        ]);

        return { products: products as IProductDocument[], total };
    }

    /**
     * Get Dashboard Analytics
     */
    async getAnalytics(): Promise<DashboardStats> {
        const [
            totalProducts,
            inventoryValueResult,
            lowStockCount,
            outOfStockCount,
            inStockCount,
            monthlyAdded
        ] = await Promise.all([
            Product.countDocuments(),
            Product.aggregate([{ $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", "$stock"] } } } }]),
            Product.countDocuments({ stock: { $gt: 0, $lte: 10 } }),
            Product.countDocuments({ stock: 0 }),
            Product.countDocuments({ stock: { $gt: 10 } }),
            Product.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } },
                { $limit: 12 }
            ])
        ]);

        const totalInventoryValue = inventoryValueResult.length > 0 ? inventoryValueResult[0].totalValue : 0;

        const productsAddedPerMonth = monthlyAdded.map(item => ({
            month: item._id,
            count: item.count
        }));

        return {
            totalProducts,
            totalInventoryValue,
            lowStockCount,
            outOfStockCount,
            stockDistribution: {
                outOfStock: outOfStockCount,
                lowStock: lowStockCount,
                inStock: inStockCount,
            },
            productsAddedPerMonth
        };
    }

    /**
     * Bulk Delete
     */
    async bulkDelete(ids: string[]): Promise<number> {
        if (!ids || ids.length === 0) return 0;
        const result = await Product.deleteMany({ _id: { $in: ids } });
        return result.deletedCount || 0;
    }

    /**
     * Bulk Update Stock
     */
    async bulkUpdateStock(ids: string[], stock: number): Promise<number> {
        if (!ids || ids.length === 0) return 0;
        if (stock < 0) throw new AppError('Stock cannot be negative', 400);
        if (!Number.isInteger(stock)) throw new AppError('Stock must be an integer', 400);

        const result = await Product.updateMany(
            { _id: { $in: ids } },
            { $set: { stock } }
        );
        return result.modifiedCount || 0;
    }

    /**
     * Get a product by ID
     */
    async getProductById(id: string): Promise<IProductDocument> {
        const product = await Product.findById(id);

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        return product;
    }

    /**
     * Update a product by ID
     */
    async updateProduct(
        id: string,
        data: UpdateProductDTO
    ): Promise<IProductDocument> {
        if (data.name !== undefined && (!data.name || !data.name.trim())) {
            throw new AppError('Product name cannot be empty', 400);
        }
        if (data.price !== undefined && data.price < 0) {
            throw new AppError('Price must be a positive number', 400);
        }
        if (data.stock !== undefined) {
            if (data.stock < 0) throw new AppError('Stock cannot be negative', 400);
            if (!Number.isInteger(data.stock))
                throw new AppError('Stock must be an integer', 400);
        }

        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name.trim();
        if (data.price !== undefined) updateData.price = data.price;
        if (data.stock !== undefined) updateData.stock = data.stock;

        const product = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        return product;
    }

    /**
     * Delete a product by ID
     */
    async deleteProduct(id: string): Promise<IProductDocument> {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        return product;
    }

    /**
     * Validate product creation data
     */
    private validateProductData(data: CreateProductDTO): void {
        const errors: string[] = [];

        if (!data.name || !data.name.trim()) {
            errors.push('Product name is required');
        }

        if (data.price === undefined || data.price === null) {
            errors.push('Product price is required');
        } else if (typeof data.price !== 'number' || data.price < 0) {
            errors.push('Price must be a positive number');
        }

        if (data.stock === undefined || data.stock === null) {
            errors.push('Product stock is required');
        } else if (typeof data.stock !== 'number' || data.stock < 0) {
            errors.push('Stock must be a non-negative integer');
        } else if (!Number.isInteger(data.stock)) {
            errors.push('Stock must be an integer');
        }

        if (errors.length > 0) {
            throw new AppError(errors.join(', '), 400);
        }
    }
}

export default new ProductService();
