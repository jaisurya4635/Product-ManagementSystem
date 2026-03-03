import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import mongoose from 'mongoose';

/**
 * Centralized error handling middleware
 */
export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Default values
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Mongoose Validation Error
    else if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        const messages = Object.values(err.errors).map((e) => e.message);
        message = messages.join(', ');
    }

    // Mongoose CastError (invalid ObjectId)
    else if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongoose Duplicate Key Error
    else if ((err as any).code === 11000) {
        statusCode = 409;
        message = 'Duplicate field value entered';
    }

    // Generic error
    else if (err.message) {
        message = err.message;
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', {
            statusCode,
            message,
            stack: err.stack,
        });
    }

    res.status(statusCode).json({
        success: false,
        data: null,
        message,
    });
};

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const error = new AppError(
        `Route not found: ${req.method} ${req.originalUrl}`,
        404
    );
    next(error);
};
