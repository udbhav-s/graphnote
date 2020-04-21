import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { TagModel } from 'src/database/models/tag.model';
import { TagCreateDto } from './dto/tagCreate.dto';

@Injectable()
export class TagService {
  constructor(@Inject('TagModel') private tagModel: ModelClass<TagModel>) {}

  async getById(id: number): Promise<TagModel> {
    return await this.tagModel.query().findById(id);
  }

  async create(body: TagCreateDto): Promise<TagModel> {
    return await this.tagModel
      .query()
      .insert(body)
      .returning('*')
      .first();
  }

  async update(id: number, body: TagCreateDto): Promise<TagModel> {
    return await this.tagModel
      .query()
      .update({ ...body, id })
      .returning('*')
      .first();
  }

  async getByWorkspace(workspaceId: number): Promise<TagModel[]> {
    return await this.tagModel.query().where({ workspaceId });
  }

  async del(id: number): Promise<number> {
    return await this.tagModel.query().deleteById(id);
  }

  async listToRelations(tags: string[], workspaceId: number): Promise<any> {
    const existingTags = await this.tagModel
      .query()
      .whereIn('name', tags)
      .andWhere({ workspaceId });
    const tagList = tags.map(name => {
      const tag = existingTags.find(t => t.name === name);
      if (tag) return { id: tag.id };
      else return { name, workspaceId };
    });
    return tagList;
  }
}
