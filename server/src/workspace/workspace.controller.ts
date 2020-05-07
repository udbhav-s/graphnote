import {
  Controller,
  UseInterceptors,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Body,
  Put,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { WorkspaceService } from './workspace.service';
import { WorkspaceModel } from '../database/models/workspace.model';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { WorkspaceCreateDto } from './dto/workspaceCreate.dto';
import { WorkspaceUserDto } from './dto/workspaceUser.dto';
import { WorkspaceUserModel } from 'src/database/models/workspaceUser.model';
import { UserService } from 'src/user/user.service';

@UseInterceptors(FormatResponseInterceptor)
@Controller('api/workspace')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/user')
  async getByUser(@Req() req): Promise<WorkspaceModel[]> {
    return await this.workspaceService.getByUser(req.user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/shared')
  async getSharedWith(@Req() req): Promise<WorkspaceModel[]> {
    return await this.workspaceService.getSharedWith(req.user.id);
  }

  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<WorkspaceModel> {
    if (!this.workspaceService.canAccess(id, req.user?.id))
      throw new ForbiddenException();

    return await this.workspaceService.getById(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/create')
  async create(
    @Body() body: WorkspaceCreateDto,
    @Req() req,
  ): Promise<WorkspaceModel> {
    return await this.workspaceService.create({
      ...body,
      userId: req.user.id,
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WorkspaceCreateDto,
    @Req() req,
  ): Promise<WorkspaceModel> {
    // check if belongs to user
    const workspace = await this.workspaceService.getById(id);
    if (req.user.id != workspace.userId) throw new ForbiddenException();

    // update
    return await this.workspaceService.update(id, body);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/user/add')
  async addUser(
    @Body() body: WorkspaceUserDto,
    @Req() req,
  ): Promise<WorkspaceUserModel> {
    // validate
    const workspace = await this.workspaceService.getById(body.workspaceId);
    if (!workspace) throw new NotFoundException();
    if (workspace.userId != req.user.id) throw new ForbiddenException();

    // check if user exists
    const user = await this.userService.getByName(body.username);
    if (!user) throw new NotFoundException('User not found');

    // check if workspace already shared with user
    if (user.id === workspace.userId) {
      throw new BadRequestException(
        "You can't share a workspace with yourself",
      );
    }
    workspace.sharedUsers.forEach(user => {
      if (user.id === workspace.userId)
        throw new BadRequestException('Workspace already shared with user');
    });

    // return
    return await this.workspaceService.addUser(workspace.id, user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/user/remove')
  async removeUser(
    @Body() body: WorkspaceUserDto,
    @Req() req,
  ): Promise<number> {
    // validate
    const workspace = await this.workspaceService.getById(body.workspaceId);
    if (!workspace) throw new NotFoundException();

    // check if user exists
    const user = await this.userService.getByName(body.username);
    if (!user) throw new NotFoundException();

    // check if user can remove
    if (workspace.userId != req.user.id && user.id != req.user.id) {
      throw new ForbiddenException();
    }

    // return
    return await this.workspaceService.removeUser(workspace.id, user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<number> {
    // validate
    const workspace = await this.workspaceService.getById(id);
    if (!workspace) throw new NotFoundException();
    if (workspace.userId != req.user.id) throw new ForbiddenException();

    // delete
    return await this.workspaceService.del(id);
  }
}
