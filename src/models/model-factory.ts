import { BaseModel } from './base-model';

export type ModelFactory<T extends BaseModel> = {
  getType(): any;
  create(json: any): T;
};
