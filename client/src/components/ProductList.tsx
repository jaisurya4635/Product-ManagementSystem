import React, { useState } from 'react';
import type { Product } from '../types/product';

interface ProductListProps {
    products: Product[];
    sort: string;
    order: 'asc' | 'desc';
    onSort: (field: string) => void;
    onToggleOrder: () => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    sort,
    order,
    onSort,
    onToggleOrder,
    onEdit,
    onDelete,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
}) => {
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p._id));
    const someSelected = products.some((p) => selectedIds.has(p._id)) && !allSelected;

    const handleSortClick = (field: string) => {
        if (sort === field) {
            onToggleOrder();
        } else {
            onSort(field);
        }
    };

    const getSortIcon = (field: string) => {
        if (sort !== field) {
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3">
                    <path d="m7 15 5 5 5-5" />
                    <path d="m7 9 5-5 5 5" />
                </svg>
            );
        }
        return order === 'asc' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m7 15 5-5 5 5" />
            </svg>
        ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m7 9 5 5 5-5" />
            </svg>
        );
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) return 'stock-out';
        if (stock <= 10) return 'stock-low';
        return 'stock-ok';
    };

    const getStockLabel = (stock: number): string => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 10) return 'Low Stock';
        return 'In Stock';
    };

    if (products.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m7.5 4.27 9 5.15" />
                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                        <path d="m3.3 7 8.7 5 8.7-5" />
                        <path d="M12 22V12" />
                    </svg>
                </div>
                <h3 className="empty-title">No products found</h3>
                <p className="empty-text">
                    Get started by adding your first product, or try a different search.
                </p>
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table className="product-table">
                <thead>
                    <tr>
                        <th className="checkbox-header">
                            <label className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                                    onChange={onToggleSelectAll}
                                />
                                <span className="checkmark"></span>
                            </label>
                        </th>
                        <th
                            className={`sortable ${sort === 'name' ? 'sorted' : ''}`}
                            onClick={() => handleSortClick('name')}
                        >
                            <span>Name</span>
                            {getSortIcon('name')}
                        </th>
                        <th
                            className={`sortable ${sort === 'price' ? 'sorted' : ''}`}
                            onClick={() => handleSortClick('price')}
                        >
                            <span>Price</span>
                            {getSortIcon('price')}
                        </th>
                        <th
                            className={`sortable ${sort === 'stock' ? 'sorted' : ''}`}
                            onClick={() => handleSortClick('stock')}
                        >
                            <span>Stock</span>
                            {getSortIcon('stock')}
                        </th>
                        <th className="status-header">Status</th>
                        <th className="actions-header">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr
                            key={product._id}
                            className={`table-row ${hoveredRow === product._id ? 'row-hover' : ''} ${selectedIds.has(product._id) ? 'row-selected' : ''}`}
                            onMouseEnter={() => setHoveredRow(product._id)}
                            onMouseLeave={() => setHoveredRow(null)}
                        >
                            <td className="checkbox-cell">
                                <label className="custom-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(product._id)}
                                        onChange={() => onToggleSelect(product._id)}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </td>
                            <td className="product-name-cell">
                                <span className="product-name">{product.name}</span>
                            </td>
                            <td className="product-price-cell">
                                <span className="product-price">{formatPrice(product.price)}</span>
                            </td>
                            <td className="product-stock-cell">
                                <span className="stock-count">{product.stock} units</span>
                            </td>
                            <td className="product-status-cell">
                                <span className={`status-badge ${getStockBadge(product.stock)}`}>
                                    <span className="status-dot"></span>
                                    {getStockLabel(product.stock)}
                                </span>
                            </td>
                            <td className="actions-cell">
                                <button
                                    className="btn-icon btn-edit"
                                    onClick={() => onEdit(product)}
                                    title="Edit product"
                                    aria-label={`Edit ${product.name}`}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                </button>
                                <button
                                    className="btn-icon btn-delete"
                                    onClick={() => onDelete(product)}
                                    title="Delete product"
                                    aria-label={`Delete ${product.name}`}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
