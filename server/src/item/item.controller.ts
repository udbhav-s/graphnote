import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Post,
  Param,
  Req,
  ForbiddenException,
  ParseIntPipe,
  NotFoundException,
  Body,
  Put,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { ItemModel } from 'src/database/models/item.model';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { ItemCreateDto } from './dto/itemCreate.dto';
import { QueryOptionsDto } from 'src/common/dto/queryOptions.dto';
import { ConnectionService } from 'src/connection/connection.service';
import { ConnectionModel } from 'src/database/models/connection.model';
import * as sanitizeHtml from 'sanitize-html';
import sanitizeHtmlOptions from '../common/util/sanitizeHtmlOptions';
import { MetadataService } from 'src/metadata/metadata.service';

@UseInterceptors(FormatResponseInterceptor)
@Controller('api/item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly connectionService: ConnectionService,
    private readonly workspaceService: WorkspaceService,
    private readonly metadataService: MetadataService
  ) {}

  @Get('/workspace/:id')
  async getByWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @Query(new ValidationPipe({ transform: true })) options: QueryOptionsDto,
    @Req() req,
  ): Promise<ItemModel[]> {
    // check if allowed
    if (!(await this.workspaceService.canAccess(id, req.user?.id)))
      throw new ForbiddenException();

    // get items
    return await this.itemService.getByWorkspace(id, options);
  }

  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<ItemModel> {
    const item = await this.itemService.getById(id);
    if (!item) throw new NotFoundException();
    if (
      !(await this.workspaceService.canAccess(item.workspaceId, req.user?.id))
    ) {
      throw new ForbiddenException();
    }

    return item;
  }

  @Get('/connected/:id')
  async getConnectedWith(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Query() options?: QueryOptionsDto,
  ): Promise<ItemModel[]> {
    const item = await this.itemService.getById(id);
    if (!item) throw new NotFoundException();
    if (
      !(await this.workspaceService.canAccess(item.workspaceId, req.user?.id))
    ) {
      throw new ForbiddenException();
    }

    const connections = await this.connectionService.getWithItem(id, options);
    const items = [] as ItemModel[];
    connections.forEach(connection => {
      const { item1, item2, ...con } = connection;
      const otherItem = item.id === item1.id ? item2 : item1;
      otherItem.connection = con as ConnectionModel;
      items.push(otherItem);
    });

    return items;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/create')
  async create(@Body() body: ItemCreateDto, @Req() req): Promise<ItemModel> {
    if (
      !(await this.workspaceService.canModify(body.workspaceId, req.user.id))
    ) {
      throw new ForbiddenException();
    }

    if (body.body) {
      body.body = sanitizeHtml(body.body, sanitizeHtmlOptions);
    }

    if (body.url) {
      let metadata = await this.metadataService.getByUrl(body.url);
      if (!metadata) {
        metadata = await this.metadataService.create(body.url);
      }
      // remove property
      delete body.url;
      // set metadata id
      body.metadataId = metadata.id;
    }

    return await this.itemService.create(body);
  }

  @UseGuards(AuthenticatedGuard)
  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ skipMissingProperties: true }))
    body: ItemCreateDto,
    @Req() req,
  ): Promise<ItemModel> {
    const item = await this.itemService.getById(id);
    if (!item) throw new NotFoundException();
    if (
      !(await this.workspaceService.canModify(item.workspaceId, req.user.id))
    ) {
      throw new ForbiddenException();
    }

    if (body.body) {
      body.body = sanitizeHtml(body.body, sanitizeHtmlOptions);
    }

    if (body.url) {
      let metadata = await this.metadataService.getByUrl(body.url);
      if (!metadata) {
        metadata = await this.metadataService.create(body.url);
      }
      // remove property
      delete body.url;
      // set metadata id
      body.metadataId = metadata.id;
    } else body.metadataId = null;

    return await this.itemService.update(id, body);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<number> {
    const item = await this.itemService.getById(id);
    if (!item) throw new NotFoundException();
    if (
      !(await this.workspaceService.canModify(item.workspaceId, req.user.id))
    ) {
      throw new ForbiddenException();
    }

    return await this.itemService.del(id);
  }
}
