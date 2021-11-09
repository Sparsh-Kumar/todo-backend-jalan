import lodash from 'lodash';
import { check, ValidationChain } from 'express-validator';
import { AppContext } from '@typings';

const createAccountValidator = (appContext: AppContext): ValidationChain[] => [
  check('firstName', 'VALIDATION_ERRORS.INVALID_FIRSTNAME').notEmpty(),
  check('lastName', 'VALIDATION_ERRORS.INVALID_LASTNAME').notEmpty(),
  check('email')
    .isEmail()
    .withMessage('VALIDATION_ERRORS.INVALID_EMAIL')
    .custom(async (email) => {
      const account = await appContext.accountRepository.findOne({
        email,
      });
      if (!lodash.isEmpty(account)) {
        return Promise.reject();
      }
    })
    .withMessage('VALIDATION_ERRORS.DUPLICATE_EMAIL'),
  check('password', 'VALIDATION_ERRORS.PASSWORD_MISSING').notEmpty(),
];

export default createAccountValidator;
