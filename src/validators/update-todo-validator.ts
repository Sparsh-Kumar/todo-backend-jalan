
import lodash from 'lodash';
import { check, ValidationChain } from 'express-validator';
import { AppContext } from '@typings';

const updateTodoValidator = (appContext: AppContext): ValidationChain [] => [
  check('title', 'VALIDATION_ERRORS.INVALID_TITLE_VALUE').notEmpty(),
  check ('id', 'VALIDATION_ERRORS.INVALID_ID').custom ((id) => {
    return appContext.todoRepository.isValidId (id);
  })
]

export default updateTodoValidator;
