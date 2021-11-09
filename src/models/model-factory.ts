import { BaseModel } from './base-model';

export type ModelFactory<T extends BaseModel> = {
  getType(): string;
  create(json: any): T;
};
