import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

// Extend Express Request to include Prisma client
declare global {
    namespace Express {
        interface Request {
            prisma: PrismaClient;
        }
    }
}

// Custom request types for different route handlers
export interface MediaParamsRequest extends Request {
    params: {
        id: string;
    };
}

export interface MediaQueryRequest extends Request {
    query: {
        page?: string;
        limit?: string;
        search?: string;
        type?: string;
        genre?: string;
        year?: string;
        sortBy?: string;
        sortOrder?: string;
    };
}