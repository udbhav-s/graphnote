import { BaseModel } from './base.model';
import { Model, QueryBuilder, raw } from 'objection';
import { WorkspaceModel } from './workspace.model';
import { ConnectionModel } from './connection.model';
import { MetadataModel } from './metadata.model';

export class ItemModel extends BaseModel {
  static tableName = 'items';

  name!: string;
  body: string;
  workspaceId: number;

  // for get connected with route
  connection: ConnectionModel;

  metadata: MetadataModel;
  workspace: WorkspaceModel;

  static modifiers = {
    search(query: QueryBuilder<ItemModel>, str: string) {
      let terms = str.split(/\s+/);
      terms = terms.map(term => term.trim());

      query.andWhere(function() {
        for (const term of terms) {
          this.orWhere(
            raw(`LOWER(name) like LOWER('%' || ? || '%')`,
            term
          ));
        }
      })
    },

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

    metadata: {
      modelClass: MetadataModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'items.metadataId',
        to: 'metadata.id',
      },
    },
  });
}
