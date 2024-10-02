import { Request, Response, NextFunction } from 'express';

/**
 * Normal Promise involves using the async-await flow that requires try-catch blocks.
 * The async handler helps to avoid repeating the blocks.
 */

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
