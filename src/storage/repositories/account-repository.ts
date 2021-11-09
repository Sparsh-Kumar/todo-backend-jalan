import { BaseRepository } from './base-repository';
import { Account, ModelFactory } from '@models';
import { RepositoryContext } from './repository-context';

export class AccountRepository extends BaseRepository<Account> {
  constructor(context: RepositoryContext) {
    super(context);
  }

  protected modelFactory(): ModelFactory<Account> {
    return {
      getType() {
        return typeof Account;
      },
      create(json: any) {
        return new Account(json);
      },
    };
  }
}
