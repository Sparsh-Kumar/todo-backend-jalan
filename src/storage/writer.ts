import { BaseModel, ModelFactory  } from '@models';
import { DeleteResult } from '@storage';
import { LooseObject } from '@typings';

export interface Writer {
  /**
   * method to save a record in the database
   */
  save: <T extends BaseModel>(
    entity: T,
    modelFactory?: ModelFactory<T>,
  ) => Promise<T>;

  /**
   * method to update a record based on the specified conditions
   */
  update: <T extends BaseModel>(
    filter: LooseObject,
    dataToUpdate: LooseObject,
    modelFactory?: ModelFactory<T>,
  ) => Promise<T>;

  /**
   * method to create multiple records in the database
   */
  saveMany: <T extends BaseModel>(
    entities: T[],
    modelFactory?: ModelFactory<T>,
  ) => Promise<T[]>;

  /**
   * method to create multiple records in the database
   */
  deleteMany: <T extends BaseModel>(
    filter: LooseObject,
    modelFactory?: ModelFactory<T>,
  ) => Promise<DeleteResult>;
}
