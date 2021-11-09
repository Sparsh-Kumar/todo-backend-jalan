import { NextFunction, Request, Response, Router } from 'express';

import { BaseController } from './base-controller';
import { AppContext } from '@typings';

export class HealthCheckController extends BaseController {
  public basePath: string = '/healthcheck';
  public router: Router = Router();

  constructor(ctx: AppContext) {
    super(ctx);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.basePath, this.runHealthcheck);
  }

  private runHealthcheck = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    res.json({ message: res.__('MESSAGES.HEALTHCHECK') });
  }
}
