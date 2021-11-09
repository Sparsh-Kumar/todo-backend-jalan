import { BaseModel } from './base-model';
import { LooseObject } from '@typings';

export class Account extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;

  constructor(json?: any) {
    super(json);
    if (json) {
      this.firstName = json.firstName;
      this.lastName = json.lastName;
      this.email = json.email;
      this.password = json.password;
    }
  }

  public serialize(): LooseObject {
    return {
      id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };
  }
}
