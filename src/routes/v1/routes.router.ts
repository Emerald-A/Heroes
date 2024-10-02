import express, { Request, Response, NextFunction } from 'express';
import { ENVType } from '../../utils/enum.util';
import ENV from '../../utils/env.util';

// import all routes
import authRoutes from './routers/auth.router';
import gameRoutes from './routers/game.router';
import inforoutes from './routers/info.router';

// create router
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/info', inforoutes);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  let environment = ENVType.DEVELOPMENT;

  if (ENV.isProduction()) {
    environment = ENVType.PRODUCTION;
  } else if (ENV.isStaging()) {
    environment = ENVType.STAGING;
  } else if (ENV.isDevelopment()) {
    environment = ENVType.DEVELOPMENT;
  }

  // return next(new ErrorResponse('Error', 400, ['Can not get API health'], { name: 'URL Shortener' }));

  res.status(200).json({
    error: false,
    errors: [],
    data: { name: 'HEROES GAMES API - V1 DEFAULT' },
    message: 'heroes-games api v1.0.0',
    status: 200,
  });
});

export default router;
