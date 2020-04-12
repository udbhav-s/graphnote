import { BaseModel } from './base.model';
import { Model } from 'objection';
import { UserModel } from './user.model';
import { WorkspaceModel } from './workspace.model';

export class WorkspaceUserModel extends BaseModel {
  static tableName = 'workspacesUsers';

  userId!: number;
  workspaceId!: number;

  user: UserModel;
  workspace: WorkspaceModel;

  static relationMappings = () => ({
    user: {
      modelClass: UserModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'workspacesUsers.userId',
        to: 'users.id'
      }
    },

    workspace: {
      modelClass: UserModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'workspacesUsers.userId',
        to: 'users.id'
      }
    },
  });
}
