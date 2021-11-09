import { IDataStore } from '@storage';
import { Logger } from '@typings';

export type RepositoryContext = {
  logger: Logger;
  store: IDataStore;
  translate: (key: string) => string;
};
