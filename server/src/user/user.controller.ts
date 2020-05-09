import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Req,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginGuard } from 'src/common/guards/login.guard';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { UserModel } from 'src/database/models/user.model';
import { SignUpDto } from './dto/signUp.dto';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';

@UseInterceptors(FormatResponseInterceptor)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Body() body: SignUpDto, @Req() req): number {
    return req.user.id;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/logout')
  logout(@Req() req) {
    return req.logout();
  }

  //@Post('/register')
  async register(@Body() body: SignUpDto): Promise<number> {
    // check if name exists
    const user = await this.userService.getByName(body.username);
    if (user) throw new BadRequestException('User already exists');
    // register
    const { id } = await this.userService.create(body);
    return id;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/current')
  async getCurrent(@Req() req): Promise<UserModel> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.userService.getById(req.user.id);
    return result as UserModel;
  }
}
