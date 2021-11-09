import { LooseObject } from '@typings';

export class BaseModel implements LooseObject {
  _id?: string;
  constructor(json: any) {
    if (json) {
      this._id = json._id;
    }
  }
}
