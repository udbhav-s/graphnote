import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { ConnectionModel } from 'src/database/models/connection.model';
import { ConnectionCreateDto } from './dto/connectionCreate.dto';

@Injectable()
export class ConnectionService {
  constructor(
    @Inject('ConnectionModel') private connectionModel: ModelClass<ConnectionModel>
  ) {}

  async getById(id: number): Promise<ConnectionModel> {
    return await this.connectionModel
      .query()
      .findById(id)
      .withGraphFetched('[item1, item2]');
  }

  async getByWorkspace(workspaceId: number): Promise<ConnectionModel[]> {
    return await this.connectionModel
      .query()
      .joinRelated('[item1, item2]')
      .where({
        'item1.workspaceId': workspaceId,
        'item2.workspaceId': workspaceId
      })
      .withGraphFetched('[item1, item2]');
  }

  async getWithItem(itemId: number): Promise<ConnectionModel[]> {
    return await this.connectionModel
      .query()
      .where('item1Id', itemId)
      .orWhere('item2Id', itemId)
      .withGraphFetched('[item1, item2]');
  }

  async create(body: ConnectionCreateDto): Promise<ConnectionModel> {
    return await this.connectionModel
      .query()
      .allowGraph('[item1, item2]')
      .insertGraphAndFetch(body)
      .first()
      .withGraphFetched('[item1, item2]');
  }

  async update(id: number, body: ConnectionCreateDto): Promise<ConnectionModel> {
    return await this.connectionModel
      .query()
      .allowGraph('[item1, item2]')
      .upsertGraphAndFetch({
        ...body,
        id
      }, { unrelate: true })
      .first()
      .withGraphFetched('[item1, item2]');
  }

  async del(id: number): Promise<number> {
    return await this.connectionModel
      .query()
      .deleteById(id);
  }
}