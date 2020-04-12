import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserModel } from '../database/models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserModel | null> {
    // get user
    let user = await this.userService.getByName(username);
    // check if user exists
    if (!user) return null;
    // compare password hash
    let match = await bcrypt.compare(password, user.password);
    if (match) {
      // strip password and return
      const { password, ...result } = user;
      return result as UserModel;
    }
    return null;
  }
}
