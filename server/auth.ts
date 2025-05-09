
import type { Request, Response, NextFunction } from 'express';
import type { Express } from 'express';

// Simplified middleware that allows all requests
export const isAuthenticated = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

// Minimal auth setup without authentication
export const setupAuth = (_app: Express) => {
  // No auth setup needed
};
