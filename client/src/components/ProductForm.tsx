import React, { useState } from 'react';
import type { Product, CreateProductPayload, FormErrors } from '../types/product';

interface ProductFormProps {
    onSubmit: (payload: CreateProductPayload) => Promise<void>;
    editProduct?: Product | null;
    onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
    onSubmit,
    editProduct,
    onCancel,
}) => {
    const [name, setName] = useState(editProduct ? editProduct.name : '');
    const [price, setPrice] = useState(editProduct ? editProduct.price.toString() : '');
    const [stock, setStock] = useState(editProduct ? editProduct.stock.toString() : '');
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const isEditMode = !!editProduct;

    const resetForm = () => {
        setName('');
        setPrice('');
        setStock('');
        setErrors({});
        setSubmitError(null);
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!price.trim()) {
            newErrors.price = 'Price is required';
        } else if (isNaN(Number(price)) || Number(price) < 0) {
            newErrors.price = 'Price must be a valid positive number';
        }

        if (!stock.trim()) {
            newErrors.stock = 'Stock is required';
        } else if (
            isNaN(Number(stock)) ||
            !Number.isInteger(Number(stock)) ||
            Number(stock) < 0
        ) {
            newErrors.stock = 'Stock must be a non-negative integer';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validate()) return;

        setSubmitting(true);

        try {
            await onSubmit({
                name: name.trim(),
                price: Number(price),
                stock: Number(stock),
            });

            if (!isEditMode) {
                resetForm();
            }
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || 'Failed to save product';
            setSubmitError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form-overlay" onClick={onCancel}>
            <div className="form-container" onClick={(e) => e.stopPropagation()}>
                <div className="form-header">
                    <h2 className="form-title">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button className="form-close" onClick={onCancel} aria-label="Close">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {submitError && (
                    <div className="form-error-banner">{submitError}</div>
                )}

                <form onSubmit={handleSubmit} className="product-form" noValidate>
                    <div className="form-group">
                        <label htmlFor="product-name" className="form-label">
                            Product Name <span className="required">*</span>
                        </label>
                        <input
                            id="product-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                            }}
                            className={`form-input ${errors.name ? 'input-error' : ''}`}
                            placeholder="Enter product name"
                            disabled={submitting}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="product-price" className="form-label">
                                Price ($) <span className="required">*</span>
                            </label>
                            <input
                                id="product-price"
                                type="number"
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                    if (errors.price)
                                        setErrors((prev) => ({ ...prev, price: undefined }));
                                }}
                                className={`form-input ${errors.price ? 'input-error' : ''}`}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={submitting}
                            />
                            {errors.price && (
                                <span className="error-text">{errors.price}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="product-stock" className="form-label">
                                Stock <span className="required">*</span>
                            </label>
                            <input
                                id="product-stock"
                                type="number"
                                value={stock}
                                onChange={(e) => {
                                    setStock(e.target.value);
                                    if (errors.stock)
                                        setErrors((prev) => ({ ...prev, stock: undefined }));
                                }}
                                className={`form-input ${errors.stock ? 'input-error' : ''}`}
                                placeholder="0"
                                min="0"
                                step="1"
                                disabled={submitting}
                            />
                            {errors.stock && (
                                <span className="error-text">{errors.stock}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting
                                ? isEditMode
                                    ? 'Updating...'
                                    : 'Creating...'
                                : isEditMode
                                    ? 'Update Product'
                                    : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
