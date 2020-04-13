import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { TagModel } from 'src/database/models/tag.model';

@Injectable()
export class TagService {
  constructor(
    @Inject('TagModel') private tagModel: ModelClass<TagModel>
  ) {}

  async listToRelations(tags: string[], workspaceId: number): Promise<any> {
    let existingTags = await this.tagModel
      .query()
      .whereIn('name', tags)
      .andWhere({ workspaceId });
    let tagList = tags.map(name => {
      let tag = existingTags.find(t => t.name === name);
      if (tag) return { id: tag.id };
      else return { name, workspaceId };
    });
    return tagList;
  }
}
