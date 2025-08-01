import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/errors';
declare const errorHandler: (error: any, req: Request, res: Response, next: NextFunction) => void;
declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
export { ApiError, errorHandler, notFound, asyncHandler };
//# sourceMappingURL=errorHandler.d.ts.map