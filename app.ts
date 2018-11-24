import prettyError from 'pretty-error';
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import config from './config';

prettyError.start();
dotenv.config();

const {apiRouter, errorHandler} = require('./routers');
const {initMiddleware, ssrMiddleware} = require('./middleware');

const app = express();

app.set('port', config.port);

app.use(initMiddleware);
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use(
  '/assets',
  express.static(path.resolve(__dirname, 'dist/assets')),
);

app.use('/api', apiRouter);

ssrMiddleware(app);

app.use(errorHandler);

export default app;
