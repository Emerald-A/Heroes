import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import ENV from '../utils/env.util';
import { ENVType } from '../utils/enum.util';
import ErrorResponse from '../utils/error.util';
import errorHandler from '../middlewares/error.mw';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import path from 'path';
import expressSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import userAgent from 'express-useragent';
import v1Routes from '../routes/v1/routes.router';

// Load environment variables
config();

// Create express application
const app = express();

// Set the view engine
app.set('view engine', 'ejs');

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

// Body parser implementation of json output

app.use(bodyParser.json({ limit: '50mb', inflate: false }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

// Http logging middleware
if (ENV.isStaging() || ENV.isDevelopment()) {
  app.use(morgan('dev'));
}

// Temporary files directory
app.use(fileUpload({ useTempFiles: true, tempFileDir: path.join(__dirname, '../tmp') }));

/**kusdhuhsuh
 * sanitize data
 * secure db against injection
 */
app.use(expressSanitize());

// secure response headers
app.use(helmet());

// Rate limiting

// Prevent http parameter pollution
app.use(hpp());

// Enable CORS
// Communicate with multiple domains
app.use(cors({ origin: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Allow-Access-Control-Origin', '*');
  res.header('Allow-Access-Control-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Allow-Access-Control-Headres', 'x-access-token, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Set user agent
app.use(userAgent.express());

// Set static directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount application routers (or routes)

app.get('/', (req: Request, res: Response, next: NextFunction) => {
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
    data: { name: 'HEROES-GAME' },
    message: 'heroes-game api v1.0.0',
    status: 200,
  });
});

// Application version-one routes
app.use('/v1', v1Routes);

app.use(errorHandler);

export default app;
