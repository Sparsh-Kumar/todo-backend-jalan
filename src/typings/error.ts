import { ValidationFailure } from '@typings';

export class AppError extends Error {
  status: string;
  statusCode: number;
}

// tslint:disable-next-line: max-classes-per-file
export class ValidationError extends AppError {
  status: string = 'DEFAULT_ERRORS.VALIDATION_FAILED';
  statusCode: number = 400;
  failures: ValidationFailure[];

  constructor(msg: string, failures: ValidationFailure[]) {
    super(msg);
    this.failures = failures;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class AuthenticationError extends AppError {
  status: string = 'DEFAULT_ERRORS.AUTHENTICATION_FAILED';
  statusCode: number = 401;

  constructor(msg: string) {
    super(msg);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class NotFoundError extends AppError {
  status: string = 'DEFAULT_ERRORS.RESOURCE_NOT_FOUND';
  statusCode: number = 404;

  constructor(msg: string) {
    super(msg);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ServerError extends AppError {
  status: string = 'DEFAULT_ERRORS.INTERNAL_SERVER_ERROR';
  statusCode: number = 500;

  constructor(msg: string) {
    super(msg);
  }
}
