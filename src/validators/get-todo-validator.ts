

import lodash from 'lodash';
import { check, ValidationChain } from 'express-validator';
import { AppContext } from '@typings';
import mongoose from 'mongoose';

/** making use of mongoose to validate ID given by the user */

const getTodoValidator = (appContext: AppContext): ValidationChain [] => [
    check ('id', 'VALIDATION_ERRORS.INVALID_TASK_ID').custom ((id) => {
        return mongoose.Types.ObjectId.isValid (id);
    })
]

export default getTodoValidator;
