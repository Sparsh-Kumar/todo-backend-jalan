
import lodash from 'lodash';
import { check, ValidationChain } from 'express-validator';
import { AppContext } from '@typings';

const createTodoValidator = (appContext: AppContext): ValidationChain[] => [
  check('title', 'VALIDATION_ERRORS.INVALID_TITLE_VALUE').notEmpty(),
  check ('title')
  .custom (async (title) => {
    const task = await appContext.todoRepository.findOne ({ title });
    if (!lodash.isEmpty (task)) {
      return Promise.reject ();  
    }
  })
  .withMessage ('VALIDATION_ERRORS.DUPLICATE_TASK')
];

export default createTodoValidator
