import { BaseModel } from './base.model';
import { Model } from 'objection';

export class UserModel extends BaseModel {
  static tableName = 'users';

  name!: string;
  password!: string;
}
