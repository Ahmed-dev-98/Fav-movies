"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFound = exports.errorHandler = exports.ApiError = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const errors_1 = require("../types/errors");
Object.defineProperty(exports, "ApiError", { enumerable: true, get: function () { return errors_1.ApiError; } });
const handleZodError = (error) => {
    const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
    }));
    return new errors_1.ApiError(400, 'Validation failed', true, JSON.stringify(errors));
};
const handlePrismaError = (error) => {
    switch (error.code) {
        case 'P2002':
            return new errors_1.ApiError(409, 'A record with this data already exists');
        case 'P2025':
            return new errors_1.ApiError(404, 'Record not found');
        case 'P2003':
            return new errors_1.ApiError(400, 'Invalid reference to related record');
        case 'P2014':
            return new errors_1.ApiError(400, 'Invalid ID provided');
        default:
            return new errors_1.ApiError(500, 'Database operation failed');
    }
};
const errorHandler = (error, req, res, next) => {
    let apiError = error;
    if (error instanceof zod_1.ZodError) {
        apiError = handleZodError(error);
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        apiError = handlePrismaError(error);
    }
    else if (!(error instanceof errors_1.ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        apiError = new errors_1.ApiError(statusCode, message, false);
    }
    if (process.env.NODE_ENV === 'development') {
        console.error('Error details:', {
            message: apiError.message,
            statusCode: apiError.statusCode,
            stack: apiError.stack,
            originalError: error,
        });
    }
    const response = {
        success: false,
        error: {
            message: apiError.message,
            statusCode: apiError.statusCode,
            ...(process.env.NODE_ENV === 'development' && {
                stack: apiError.stack,
            }),
        },
    };
    if (error instanceof zod_1.ZodError) {
        response.error.validationErrors = JSON.parse(apiError.stack || '[]');
    }
    res.status(apiError.statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    const error = new errors_1.ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};
exports.notFound = notFound;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map