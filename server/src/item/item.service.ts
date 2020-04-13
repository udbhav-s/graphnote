import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { ItemModel } from 'src/database/models/item.model';
import { ItemCreateDto } from './dto/itemCreate.dto';

@Injectable()
export class ItemService {
  constructor(
    @Inject('ItemModel') private itemModel: ModelClass<ItemModel> 
  ) {}

  async getById(id: number): Promise<ItemModel> {
    return await this.itemModel.query().findById(id);
  }

  async getByWorkspace(workspaceId: number): Promise<ItemModel[]> {
    return await this.itemModel.query().where({ workspaceId });
  }

  async create(item: ItemCreateDto): Promise<ItemModel> {
    return await this.itemModel
      .query()
      .insert(item)
      .returning('*')
      .first();
  }

  async update(id: number, item: ItemCreateDto): Promise<ItemModel> {
    return await this.itemModel
      .query()
      .where({ id })
      .patch(item)
      .returning('*')
      .first();
  }

  async del(id: number): Promise<number> {
    return await this.itemModel
      .query()
      .deleteById(id);
  }
}
