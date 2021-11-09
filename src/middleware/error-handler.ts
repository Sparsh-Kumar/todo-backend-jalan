import { ErrorRequestHandler, RequestHandler } from 'express';

import { ErrorPayload, Errors } from '@typings';

export const notFoundHandler: RequestHandler = (req, res, next) => {
  next(new Errors.NotFoundError(res.__('DEFAULT_ERRORS.RESOURCE_NOT_FOUND')));
};

export const serverErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  if (!err.statusCode) {
    err.statusCode = 500;
    err.status = res.__('DEFAULT_ERRORS.INTERNAL_SERVER_ERROR');
  }
  const payload: ErrorPayload = {
    message: err.message,
  };

  if (err.failures) {
    payload.failures = err.failures;
  }
  res.status(err.statusCode).json(payload);
  next();
};
