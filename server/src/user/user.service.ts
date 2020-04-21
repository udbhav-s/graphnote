import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UserModel } from 'src/database/models/user.model';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@Inject('UserModel') private userModel: ModelClass<UserModel>) {}

  async getById(id: number): Promise<UserModel> {
    return await this.userModel.query().findById(id);
  }

  async getByName(name: string): Promise<UserModel> {
    return await this.userModel
      .query()
      .where({ name })
      .first();
  }

  async create(body: SignUpDto): Promise<UserModel> {
    const user = {} as any;
    user.password = await bcrypt.hash(body.password, 12);
    user.name = body.username;
    return await this.userModel
      .query()
      .insert(user)
      .returning('*');
  }
}
