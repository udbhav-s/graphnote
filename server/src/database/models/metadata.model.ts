import { BaseModel } from './base.model';
import { Model } from 'objection';
import { ItemModel } from './item.model';
import { ConnectionModel } from './connection.model';

export class MetadataModel extends BaseModel {
  static tableName = 'metadata';

  name!: string;
  url: string;
  title: string;
  description: string;

  connections: ConnectionModel[];
  items: ItemModel[];

  static modifiers = {
    ...BaseModel.modifiers,
  };

  static relationMappings = () => ({
    connections: {
      modelClass: ConnectionModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'metadata.id',
        to: 'connections.metadataId'
      },
    },

    items: {
      modelClass: ItemModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'metadata.id',
        to: 'items.metadataId'
      },
    },
  });
}
