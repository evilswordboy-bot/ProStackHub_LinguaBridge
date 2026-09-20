import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Log sanitized error on server only — never expose secrets or raw stack traces to client
  console.error(`[API Error] [${req.method} ${req.url}]:`, err.message || err);

  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: statusCode === 500
        ? 'Translation failed. Please try again.'
        : err.message || 'Translation failed. Please try again.'
    }
  });
}
