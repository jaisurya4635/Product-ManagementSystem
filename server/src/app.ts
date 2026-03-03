import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

// ========================
// Global Middleware
// ========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// Health Check
// ========================
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        data: null,
        message: 'Server is running',
    });
});

// ========================
// Routes
// ========================
app.use('/api/products', productRoutes);

// ========================
// Error Handling
// ========================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
