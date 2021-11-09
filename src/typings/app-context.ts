import { Repositories } from '@storage';
import { Logger } from '@typings';

export type AppContext = {
  logger: Logger;
  accountRepository: Repositories.AccountRepository;
};
