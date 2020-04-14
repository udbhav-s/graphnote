import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { ConnectionModel } from 'src/database/models/connection.model';
import { ConnectionCreateDto } from './dto/connectionCreate.dto';
import { QueryOptionsDto } from 'src/common/dto/queryOptions.dto';
import { QUERY_OPTIONS } from 'src/database/modifiers';

@Injectable()
export class ConnectionService {
  constructor(
    @Inject('ConnectionModel') private connectionModel: ModelClass<ConnectionModel>
  ) {}

  async getById(id: number): Promise<ConnectionModel> {
    return await this.connectionModel
      .query()
      .findById(id)
      .withGraphFetched('[item1, item2, tags]');
  }

  async getByWorkspace(workspaceId: number, options: QueryOptionsDto): Promise<ConnectionModel[]> {
    let query = this.connectionModel
      .query()
      .joinRelated('[item1, item2]')
      .where({
        'item1.workspaceId': workspaceId,
        'item2.workspaceId': workspaceId
      })
      .withGraphFetched('[item1, item2, tags]');

    if (options) query.modify(QUERY_OPTIONS, options);

    return await query;
  }

  async getWithItem(itemId: number, options: QueryOptionsDto): Promise<ConnectionModel[]> {
    let query = this.connectionModel
      .query()
      .where('item1Id', itemId)
      .orWhere('item2Id', itemId)
      .withGraphFetched('[item1, item2, tags]');

    if (options) query.modify(QUERY_OPTIONS, options);

    return await query;
  }

  async create(body: ConnectionCreateDto): Promise<ConnectionModel> {
    return await this.connectionModel
      .query()
      .allowGraph('[item1, item2, tags]')
      .insertGraphAndFetch(body, { relate: true })
      .first()
      .withGraphFetched('[item1, item2, tags]');
  }

  async update(id: number, body: ConnectionCreateDto): Promise<ConnectionModel> {
    return await this.connectionModel
      .query()
      .allowGraph('[item1, item2, tags]')
      .upsertGraphAndFetch({
        ...body,
        id
      }, { relate: true, unrelate: true })
      .first()
      .withGraphFetched('[item1, item2, tags]');
  }

  async del(id: number): Promise<number> {
    return await this.connectionModel
      .query()
      .deleteById(id);
  }
}
