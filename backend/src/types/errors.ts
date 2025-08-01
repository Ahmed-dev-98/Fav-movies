export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export interface ErrorResponse {
    success: false;
    error: {
        message: string;
        statusCode: number;
        validationErrors?: Array<{
            field: string;
            message: string;
            code: string;
        }>;
        stack?: string;
    };
}