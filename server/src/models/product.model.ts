import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
    name: string;
    price: number;
    stock: number;
    createdAt: Date;
}

const productSchema = new Schema<IProductDocument>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            minlength: [1, 'Product name cannot be empty'],
            maxlength: [200, 'Product name cannot exceed 200 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price must be a positive number'],
        },
        stock: {
            type: Number,
            required: [true, 'Product stock is required'],
            min: [0, 'Stock cannot be negative'],
            validate: {
                validator: Number.isInteger,
                message: 'Stock must be an integer',
            },
        },
    },
    {
        timestamps: true,
    }
);

// Index for search performance
productSchema.index({ name: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model<IProductDocument>('Product', productSchema);

export default Product;
