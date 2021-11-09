import lodash from 'lodash';
import { check, ValidationChain } from 'express-validator';
import { AppContext } from '@typings';

const createAccessTokenValidator = (
  appContext: AppContext,
): ValidationChain[] => [
  check('email')
    .isEmail()
    .withMessage('VALIDATION_ERRORS.INVALID_EMAIL')
    .custom(async (email) => {
      const account = await appContext.accountRepository.findOne({
        email,
      });
      if (lodash.isEmpty(account)) {
        return Promise.reject();
      }
    })
    .withMessage('DEFAULT_ERRORS.LOGIN_AUTHENTICATION_FAILED'),
  check('password', 'VALIDATION_ERRORS.PASSWORD_MISSING').notEmpty(),
];

export default createAccessTokenValidator;
