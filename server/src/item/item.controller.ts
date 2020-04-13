import { Controller, UseGuards, UseInterceptors, Get, Post, Param, Req, ForbiddenException, ParseIntPipe, NotFoundException, Body, Put, Delete, ValidationPipe } from '@nestjs/common';
import { ItemService } from './item.service';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { ItemModel } from 'src/database/models/item.model';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { ItemCreateDto } from './dto/itemCreate.dto';

@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly workspaceService: WorkspaceService
  ) {}

  @Get('/workspace/:id')
  async getByWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<ItemModel[]> {
    // check if allowed
    if (!await this.workspaceService.canAccess(id, req.user.id))
      throw new ForbiddenException();
    
    // get items 
    return await this.itemService.getByWorkspace(id);
  }

  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<ItemModel> {
    let item = await this.itemService.getById(id);
    if (!item) throw new NotFoundException();
    if (!await this.workspaceService.canAccess(item.workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }

    return item;
  }

  @Post('/create')
  async create(
    @Body() body: ItemCreateDto,
    @Req() req
  ): Promise<ItemModel> {
    if (!await this.workspaceService.canModify(body.workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }

    return await this.itemService.create(body);
  }

  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ skipMissingProperties: true })) body: ItemCreateDto,
    @Req() req
  ): Promise<ItemModel> {
    let item = await this.itemService.getById(id);
    if (!item) throw new NotFoundException();
    if (!await this.workspaceService.canModify(item.workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }

    return await this.itemService.update(id, body);
  }

  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<number> {
    let item = await this.itemService.getById(id);
    if (!item) throw new NotFoundException();
    if (!await this.workspaceService.canModify(item.workspaceId, req.user.id)) {
      throw new ForbiddenException();
    }

    return await this.itemService.del(id);
  }
}
