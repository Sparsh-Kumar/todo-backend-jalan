import { Reader } from './reader';
import { Writer } from './writer';

export interface IDataStore extends Reader, Writer {
  /**
   * convert id string to object id
   */
  toObjectId: (id: string) => any;
  /**
   * validate if the string is a valid mongoose Id
   */
  isValidId: (id: string) => boolean;
}
