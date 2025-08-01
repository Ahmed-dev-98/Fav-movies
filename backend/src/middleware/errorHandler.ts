import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../types/errors';
import type { ErrorResponse, ValidationError } from '../types/media';

// Handle Zod validation errors
const handleZodError = (error: ZodError): ApiError => {
  const errors: ValidationError[] = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));

  return new ApiError(400, 'Validation failed', true, JSON.stringify(errors));
};

// Handle Prisma errors
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): ApiError => {
  switch (error.code) {
    case 'P2002':
      return new ApiError(409, 'A record with this data already exists');
    case 'P2025':
      return new ApiError(404, 'Record not found');
    case 'P2003':
      return new ApiError(400, 'Invalid reference to related record');
    case 'P2014':
      return new ApiError(400, 'Invalid ID provided');
    default:
      return new ApiError(500, 'Database operation failed');
  }
};

// Main error handler middleware
const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  let apiError = error;

  // Convert different error types to ApiError
  if (error instanceof ZodError) {
    apiError = handleZodError(error);
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    apiError = handlePrismaError(error);
  } else if (!(error instanceof ApiError)) {
    // Handle unknown errors
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    apiError = new ApiError(statusCode, message, false);
  }

  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', {
      message: apiError.message,
      statusCode: apiError.statusCode,
      stack: apiError.stack,
      originalError: error,
    });
  }

  // Send error response
  const response: ErrorResponse = {
    success: false,
    error: {
      message: apiError.message,
      statusCode: apiError.statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        stack: apiError.stack,
      }),
    },
  };

  // Include validation errors if available
  if (error instanceof ZodError) {
    response.error.validationErrors = JSON.parse(apiError.stack || '[]');
  }

  res.status(apiError.statusCode).json(response);
};

// 404 handler
const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

// Async error handler wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export { ApiError, errorHandler, notFound, asyncHandler };