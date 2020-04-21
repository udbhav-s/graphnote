import { BaseModel } from './base.model';
import { Model } from 'objection';
import { WorkspaceModel } from './workspace.model';
import { ConnectionModel } from './connection.model';

export class TagModel extends BaseModel {
  static tableName = 'tags';

  name!: string;
  workspaceId: number;

  workspace: WorkspaceModel;
  connections: ConnectionModel[];

  static relationMappings = () => ({
    workspace: {
      modelClass: WorkspaceModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'tags.workspaceId',
        to: 'workspaces.id',
      },
    },

    connections: {
      modelClass: ConnectionModel,
      relation: Model.ManyToManyRelation,
      join: {
        from: 'tags.id',
        through: {
          from: 'connectionsTags.tagId',
          to: 'connectionsTags.connectionId',
        },
        to: 'connections.id',
      },
    },
  });
}
