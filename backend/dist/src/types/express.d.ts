import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
declare global {
    namespace Express {
        interface Request {
            prisma: PrismaClient;
        }
    }
}
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
//# sourceMappingURL=express.d.ts.map