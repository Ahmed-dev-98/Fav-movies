export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean, stack?: string);
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
//# sourceMappingURL=errors.d.ts.map