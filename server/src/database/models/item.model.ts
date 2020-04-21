import { BaseModel } from './base.model';
import { Model } from 'objection';
import { WorkspaceModel } from './workspace.model';
import { ConnectionModel } from './connection.model';

export class ItemModel extends BaseModel {
  static tableName = 'items';

  name!: string;
  url: string;
  body: string;
  workspaceId: number;

  // for get connected with route
  connection: ConnectionModel;

  workspace: WorkspaceModel;

  static modifiers = {
    ...BaseModel.modifiers,
  };

  static relationMappings = () => ({
    workspace: {
      modelClass: WorkspaceModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'items.workspaceId',
        to: 'workspaces.id',
      },
    },
  });
}
