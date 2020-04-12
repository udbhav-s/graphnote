import { BaseModel } from './base.model';
import { Model } from 'objection';
import { WorkspaceModel } from './workspace.model';

export class ItemModel extends BaseModel {
  static tableName = 'items';

  name!: string;
  url: string;
  body: string;
  workspaceId: number;

  workspace: WorkspaceModel;

  static relationMappings = () => ({
    workspace: {
      modelClass: WorkspaceModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'items.workspaceId',
        to: 'workspaces.id'
      }
    },
  });
}
