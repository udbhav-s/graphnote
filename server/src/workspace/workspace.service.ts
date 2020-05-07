import { Injectable, Inject } from '@nestjs/common';
import { ModelClass } from 'objection';
import { WorkspaceModel } from 'src/database/models/workspace.model';
import { WorkspaceUserModel } from 'src/database/models/workspaceUser.model';
import { WorkspaceCreateDto } from './dto/workspaceCreate.dto';
import { GET_USERS } from 'src/database/modifiers';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject('WorkspaceModel')
    private workspaceModel: ModelClass<WorkspaceModel>,
    @Inject('WorkspaceUserModel')
    private workspaceUserModel: ModelClass<WorkspaceUserModel>,
  ) {}

  async getById(id: number): Promise<WorkspaceModel> {
    return await this.workspaceModel
      .query()
      .findById(id)
      .modify(GET_USERS);
  }

  async getByUser(userId: number): Promise<WorkspaceModel[]> {
    return await this.workspaceModel
      .query()
      .where({ userId })
      .modify(GET_USERS);
  }

  async getSharedWith(userId: number): Promise<WorkspaceModel[]> {
    return await this.workspaceModel
      .query()
      .joinRelated('sharedUsers')
      .where('sharedUsers.id', userId)
      .modify(GET_USERS);
  }

  async create(body: WorkspaceCreateDto): Promise<WorkspaceModel> {
    return await this.workspaceModel
      .query()
      .insert(body)
      .returning('*')
      .first();
  }

  async update(id: number, body: WorkspaceCreateDto): Promise<WorkspaceModel> {
    return await this.workspaceModel
      .query()
      .where({ id })
      .patch(body)
      .returning('*')
      .modify(GET_USERS)
      .first();
  }

  async addUser(id: number, userId: number): Promise<WorkspaceUserModel> {
    return await this.workspaceUserModel.query().insert({
      workspaceId: id,
      userId,
    });
  }

  async removeUser(id: number, userId: number): Promise<number> {
    return await this.workspaceUserModel
      .query()
      .where({
        workspaceId: id,
        userId,
      })
      .del();
  }

  async del(id: number): Promise<number> {
    return await this.workspaceModel.query().deleteById(id);
  }

  async canModify(id: number, userId: number | undefined): Promise<boolean> {
    const workspace = await this.getById(id);
    if (!workspace) return false;
    return (
      workspace.userId === userId ||
      workspace.sharedUsers.some(user => user.id === userId)
    );
  }

  async canAccess(id: number, userId: number | undefined): Promise<boolean> {
    const workspace = await this.getById(id);
    if (!workspace) return false;
    return (await this.canModify(id, userId)) || workspace.public;
  }
}
