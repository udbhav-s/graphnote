import { Controller, UseGuards, UseInterceptors, Get, Param, ParseIntPipe, Req, ForbiddenException, NotFoundException, Body, Post, ValidationPipe, Put, Delete } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { ConnectionService } from './connection.service';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { ConnectionModel } from 'src/database/models/connection.model';
import { ItemService } from 'src/item/item.service';
import { ConnectionCreateDto } from './dto/connectionCreate.dto';
import { ItemCreateDto } from 'src/item/dto/itemCreate.dto';

@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/connection')
export class ConnectionController {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly workspaceService: WorkspaceService,
    private readonly itemService: ItemService
  ) {}

  @Get('/workspace/:id')
  async getByWorkspace(
    @Param('id', ParseIntPipe) workspaceId: number,
    @Req() req
  ): Promise<ConnectionModel[]> {
    if (!await this.workspaceService.canAccess(workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }

    return await this.connectionService.getByWorkspace(workspaceId);
  }

  @Get('/item/:id')
  async getWithItem(
    @Param('id', ParseIntPipe) itemId: number,
    @Req() req
  ): Promise<ConnectionModel[]> {
    // check if user can access 
    let item = await this.itemService.getById(itemId);
    if (!item) throw new NotFoundException();

    if (!await this.workspaceService.canAccess(item.workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }

    // get connections
    return await this.connectionService.getWithItem(itemId);
  }

  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<ConnectionModel> {
    // check if user can access 
    let connection = await this.connectionService.getById(id);
    if (!connection) throw new NotFoundException();

    if (!await this.workspaceService.canAccess(connection.item1.workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }

    return connection;
  }

  @Post('/create')
  async create(
    @Body(new ValidationPipe({ transform: true })) body: ConnectionCreateDto,
    @Req() req
  ): Promise<ConnectionModel> {
    let item = await this.validateConnectionItems(body);

    if (!await this.workspaceService.canModify(item.workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }

    return await this.connectionService.create(body);
  }

  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) body: ConnectionCreateDto,
    @Req() req
  ): Promise<ConnectionModel> {
    let connection = await this.connectionService.getById(id);
    if (!connection) throw new NotFoundException();

    if (!await this.workspaceService.canModify(connection.item1.workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }

    await this.validateConnectionItems(body);
    
    return await this.connectionService.update(id, body);
  }

  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<number> {
    let connection = await this.connectionService.getById(id);
    if (!connection) throw new NotFoundException();

    if (!await this.workspaceService.canModify(connection.item1.workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }
    
    return await this.connectionService.del(id);
  }

  // util
  async validateConnectionItems(body: ConnectionCreateDto): Promise<ItemCreateDto> {
    let { item1, item2 } = body;
    if (body.item1Id) {
      item1 = await this.itemService.getById(body.item1Id);
      if (!item1) throw new NotFoundException();
    }
    if (body.item2Id) {
      item2 = await this.itemService.getById(body.item2Id);
      if (!item2) throw new NotFoundException();
    }

    if (item1.workspaceId !== item2.workspaceId) 
      throw new ForbiddenException();

    return item1;
  }
}
