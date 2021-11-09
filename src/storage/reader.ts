import { BaseModel, ModelFactory } from '@models';
import { QueryOptions } from '@storage';
import { LooseObject } from '@typings';

export interface Reader {
  /**
   * method to get all records from the database
   */
  getAll: <T extends BaseModel>(
    data?: LooseObject,
    options?: QueryOptions,
    modelFactory?: ModelFactory<T>,
  ) => Promise<T[]>;

  /**
   * method to get record by unique id
   * @param {string} id - id of the record to retreive
   */
  findById: <T extends BaseModel>(
    id: string,
    options?: QueryOptions,
    modelFactory?: ModelFactory<T>,
  ) => Promise<T>;

  /**
   * method to get one record matching the provided condition(s)
   * @param {Object} data - conditions to check when retreiving data. eg: { foo: 'bar' }
   */
  findOne: <T extends BaseModel>(
    data?: LooseObject,
    options?: QueryOptions,
    modelFactory?: ModelFactory<T>,
  ) => Promise<T>;

  /**
   * method to count records in a collection based on the provided condition(s)
   * @param {Object} data - conditions to check when retreiving data. eg: { foo: 'bar' }
   */
  count: <T extends BaseModel>(
    data?: LooseObject,
    modelFactory?: ModelFactory<T>,
  ) => Promise<number>;
}
