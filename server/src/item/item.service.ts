import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { ItemModel } from 'src/database/models/item.model';
import { ItemCreateDto } from './dto/itemCreate.dto';
import { QueryOptionsDto } from 'src/common/dto/queryOptions.dto';
import { QUERY_OPTIONS, SEARCH } from 'src/database/modifiers';

@Injectable()
export class ItemService {
  constructor(@Inject('ItemModel') private itemModel: ModelClass<ItemModel>) {}

  async getById(id: number): Promise<ItemModel> {
    return await this.itemModel.query().findById(id).withGraphFetched("metadata");
  }

  async getByWorkspace(
    workspaceId: number,
    options: QueryOptionsDto,
  ): Promise<ItemModel[]> {
    const query = this.itemModel
      .query()
      .where({ workspaceId })
      .withGraphFetched("metadata")
      .modify(QUERY_OPTIONS, options);
    
    if (options.search) query.modify(SEARCH, options.search);

    return await query;
  }

  async create(item: ItemCreateDto): Promise<ItemModel> {
    return await this.itemModel
      .query()
      .insert(item)
      .returning('*')
      .withGraphFetched("metadata")
      .first();
  }

  async update(id: number, item: ItemCreateDto): Promise<ItemModel> {
    return await this.itemModel
      .query()
      .where({ id })
      .patch(item)
      .returning('*')
      .withGraphFetched("metadata")
      .first();
  }

  async del(id: number): Promise<number> {
    return await this.itemModel.query().deleteById(id);
  }
}
