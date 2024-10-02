import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';

// declare global namespace

declare global {
  namespace Express {
    interface Request {
      language?: any;
      channel?: any;
    }
  }
}

// create function

export const validateChannels = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.APP_CHANNELS) {
    return next(new ErrorResponse('Error', 500, ['There is an error. Please contact support']));
  }

  const channelStr: string = process.env.APP_CHANNELS;

  try {
    if (!req.headers.lg && !req.headers.ch) {
      return next(
        new ErrorResponse('Security violation', 403, ['Language not specified', 'Device channel not specified'])
      );
    }

    if (!req.headers.lg) {
      return next(new ErrorResponse('Security violation', 403, ['Language not specified']));
    }

    if (!req.headers.ch) {
      return next(new ErrorResponse('Security violation', 403, ['Device channel not specified']));
    }

    const ch: string = req.headers.ch.toString();
    const lg: string = req.headers.lg.toString();
    const channels = channelStr.split(',');

    if (lg.length > 2) {
      return next(new ErrorResponse('Security violation', 403, ['Language not specified']));
    }

    if (!channels.includes(ch)) {
      return next(new ErrorResponse('Security violation', 403, ['Device channel not specified']));
    }

    req.language = lg;
    req.channel = ch;

    next();
  } catch (err) {}
};
