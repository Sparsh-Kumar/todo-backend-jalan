import bodyParser from 'body-parser';
import config from 'config';
import express, { Application } from 'express';
import expressWinston from 'express-winston';
import { Server } from 'http';
import i18n from 'i18n';
import path from 'path';

import {
  AccountController,
  BaseController,
  HealthCheckController,
} from '@controllers';
import { ErrorHandler } from '@middleware';
import { EventListeners, logger } from '@server';
import { AppContext } from '@typings';

export class App {
  public expressApp: Application;
  private ctx: AppContext;

  constructor(ctx: AppContext) {
    this.expressApp = express();
    this.ctx = ctx;
  }

  public listen(): Server {
    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandling();
    const PORT = config.get('www.port');
    const server = this.expressApp.listen(PORT);
    server.on('listening', EventListeners.onListening);
    server.on('error', EventListeners.onError);
    return server;
  }

  public initializeMiddlewares() {
    i18n.configure({
      autoReload: true,
      directory: path.join(__dirname, '../locales'),
      objectNotation: true,
    });
    this.expressApp.use(i18n.init);

    this.expressApp.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Accept-Language',
      );
      next();
    });

    const LOGGER_CONSOLE = config.has('logger.console')
      ? config.get('logger.console')
      : false;
    if (LOGGER_CONSOLE) {
      this.expressApp.use(
        expressWinston.logger({
          winstonInstance: logger,
          meta: false,
          msg:
            "request - {{req.ip}} - {{res.statusCode}} - {{req.method}} - {{res.responseTime}}ms - {{req.url}} - {{req.headers['user-agent']}}",
          expressFormat: false,
          colorize: true,
        }),
      );
    }

    this.expressApp.use(bodyParser.json());
  }

  public initializeErrorHandling() {
    this.expressApp.use(ErrorHandler.notFoundHandler);
    this.expressApp.use(ErrorHandler.serverErrorHandler);
    this.expressApp.use(
      expressWinston.errorLogger({
        winstonInstance: logger,
      }),
    );
  }

  public initializeControllers() {
    const controllers: BaseController[] = [
      new AccountController(this.ctx),
      new HealthCheckController(this.ctx),
    ];

    for (const ctrl of controllers) {
      this.expressApp.use('/', ctrl.router);
    }
  }
}
