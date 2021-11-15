
import lodash from 'lodash';

import { BaseController } from './base-controller';
import { NextFunction, Response, Router } from 'express';
import { AuthHelper, Validation } from '@helpers';
import { Todo } from '@models';
import {
    AppContext,
    Errors,
    ExtendedRequest,
    ValidationFailure,
} from '@typings';
import {
    createTodoValidator,
    deleteTodoValidator
} from '@validators';
import _ from 'lodash';

export class TodoController extends BaseController {
  public basePath: string = '/todo';
  public router: Router = Router ();

  constructor(ctx: AppContext) {
      super(ctx);
      this.initializeRoutes();
  }

  private initializeRoutes() {
      this.router.post (`${this.basePath}`, createTodoValidator (this.appContext), this.createTodo);
      this.router.delete (`${this.basePath}/:id`, deleteTodoValidator (this.appContext), this.deleteTodo);
  }

  private createTodo = async (
      req: ExtendedRequest,
      res: Response,
      next: NextFunction,
  ) => {
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
      const { title } = req.body;
      const todo = await this.appContext.todoRepository.save(new Todo ({ title }) );
      return res.status(201).json(todo.serialize());
  }

  private deleteTodo = async (
      req: ExtendedRequest,
      res: Response,
      next: NextFunction
  ) => {

    const failures: ValidationFailure [] = Validation.extractValidationErrors (
      req,
    );
    if (failures.length > 0) {
      const valError = new Errors.ValidationError (
          res.__('DEFAULT_ERRORS.VALIDATION_FAILED'),
          failures
      );
      return next (valError);
    }
    const _id = req.params.id;
    const todoExist = await this.appContext.todoRepository.findOne ({ _id });
    if (_.isEmpty (todoExist)) {
        return res.status (404).json ({ message: res.__('VALIDATION_ERRORS.TASK_NOT_EXIST') });
    }
    const deletedTodo = await this.appContext.todoRepository.deleteMany ({ _id });
    return res.status (204);
  }
}
