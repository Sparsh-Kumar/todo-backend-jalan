import { Router } from 'express';

import { AppContext, Logger } from '@typings';

export class BaseController {
  public basePath: string;
  public router: Router;
  protected appContext: AppContext;

  constructor(ctx: AppContext) {
    this.appContext = ctx;
  }

  protected getLogger(): Logger {
    return this.appContext.logger;
  }
}
