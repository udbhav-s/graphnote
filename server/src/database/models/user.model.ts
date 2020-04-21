import { BaseModel } from './base.model';
import { Model } from 'objection';
import { WorkspaceModel } from './workspace.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  name!: string;
  password?: string;

  workspaces: WorkspaceModel[];
  sharedWorkspaces: WorkspaceModel[];

  static relationMappings = () => ({
    workspaces: {
      modelClass: WorkspaceModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'users.id',
        to: 'workspaces.userId',
      },
    },

    sharedWorkspaces: {
      modelClass: WorkspaceModel,
      relation: Model.ManyToManyRelation,
      join: {
        from: 'users.id',
        through: {
          from: 'workspacesUsers.userId',
          to: 'workspacesUsers.workspaceId',
        },
        to: 'workspaces.id',
      },
    },
  });
}
