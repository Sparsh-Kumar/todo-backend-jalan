import lodash from 'lodash';

import { BaseController } from './base-controller';
import { NextFunction, Response, Router } from 'express';
import { AuthHelper, Validation } from '@helpers';
import { Account } from '@models';
import {
  AppContext,
  Errors,
  ExtendedRequest,
  ValidationFailure,
} from '@typings';
import {
  createAccessTokenValidator,
  createAccountValidator,
} from '@validators';

export class AccountController extends BaseController {
  public basePath: string = '/account';
  public router: Router = Router();

  constructor(ctx: AppContext) {
    super(ctx);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.basePath}`,
      createAccountValidator(this.appContext),
      this.createAccount,
    );
    this.router.post(
      `${this.basePath}/access_token`,
      createAccessTokenValidator(this.appContext),
      this.createAccessToken,
    );
  }

  private createAccount = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    // TODO jjalan: Find a way to do this not in each action
    const failures: ValidationFailure[] = Validation.extractValidationErrors(
      req,
    );
    if (failures.length > 0) {
      const valError = new Errors.ValidationError(
        res.__('DEFAULT_ERRORS.VALIDATION_FAILED'),
        failures,
      );
      return next(valError);
    }

    const { email, firstName, lastName, password } = req.body;
    const hashedPassword = await AuthHelper.encryptPassword(password);
    const account = await this.appContext.accountRepository.save(
      new Account({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      }),
    );
    res.status(201).json(account.serialize());
  }

  private createAccessToken = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    // TODO jjalan: Find a way to do this not in each action
    const failures: ValidationFailure[] = Validation.extractValidationErrors(
      req,
    );
    if (failures.length > 0) {
      const valError = new Errors.ValidationError(
        res.__('DEFAULT_ERRORS.VALIDATION_FAILED'),
        failures,
      );
      return next(valError);
    }

    const { email, password } = req.body;
    const account = await this.appContext.accountRepository.findOne({ email });

    const accountPassword = account ? account.password : undefined;
    const isPasswordValid = await AuthHelper.comparePassword(
      password,
      accountPassword,
    );
    if (!isPasswordValid) {
      return next(
        new Errors.AuthenticationError(
          res.__('DEFAULT_ERRORS.LOGIN_AUTHENTICATION_FAILED'),
        ),
      );
    }
    const token = AuthHelper.createAccessToken({ accountId: account._id });
    res.json({ token, id: account._id });
  }
}
