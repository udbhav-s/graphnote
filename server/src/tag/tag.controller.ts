import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  Req,
  ForbiddenException,
  ParseIntPipe,
  Body,
  Post,
  Put,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { TagModel } from 'src/database/models/tag.model';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { TagCreateDto } from './dto/tagCreate.dto';

@UseInterceptors(FormatResponseInterceptor)
@Controller('api/tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Get('/workspace/:id')
  async getByWorkspace(
    @Param('id', ParseIntPipe) workspaceId: number,
    @Req() req,
  ): Promise<TagModel[]> {
    if (!(await this.workspaceService.canAccess(workspaceId, req.user.id))) {
      throw new ForbiddenException();
    }

    return await this.tagService.getByWorkspace(workspaceId);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/create')
  async create(@Body() body: TagCreateDto, @Req() req): Promise<TagModel> {
    if (
      !(await this.workspaceService.canAccess(body.workspaceId, req.user.id))
    ) {
      throw new ForbiddenException();
    }

    return await this.tagService.create(body);
  }

  @UseGuards(AuthenticatedGuard)
  @Put('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TagCreateDto,
    @Req() req,
  ): Promise<TagModel> {
    const tag = await this.tagService.getById(id);
    if (!tag) throw new NotFoundException();
    if (
      !(await this.workspaceService.canAccess(tag.workspaceId, req.user.id))
    ) {
      throw new ForbiddenException();
    }

    return this.tagService.update(id, body);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async del(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<number> {
    const tag = await this.tagService.getById(id);
    if (!tag) throw new NotFoundException();
    if (
      !(await this.workspaceService.canAccess(tag.workspaceId, req.user.id))
    ) {
      throw new ForbiddenException();
    }

    return this.tagService.del(id);
  }
}
