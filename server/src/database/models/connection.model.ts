import { BaseModel } from './base.model';
import { Model } from 'objection';
import { ItemModel } from './item.model';
import { TagModel } from './tag.model';
import { MetadataModel } from './metadata.model';

export class ConnectionModel extends BaseModel {
  static tableName = 'connections';

  name: string;
  item1Id: number;
  item2Id: number;

  item1?: ItemModel;
  item2?: ItemModel;
  tags?: TagModel[];
  metadata?: MetadataModel;

  static modifiers = {
    ...BaseModel.modifiers,
  };

  static relationMappings = () => ({
    item1: {
      modelClass: ItemModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'connections.item1Id',
        to: 'items.id',
      },
    },

    item2: {
      modelClass: ItemModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'connections.item2Id',
        to: 'items.id',
      },
    },

    tags: {
      modelClass: TagModel,
      relation: Model.ManyToManyRelation,
      join: {
        from: 'connections.id',
        through: {
          from: 'connectionsTags.connectionId',
          to: 'connectionsTags.tagId',
        },
        to: 'tags.id',
      },
    },

    metadata: {
      modelClass: MetadataModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'connections.metadataId',
        to: 'metadata.id',
      },
    },
  });
}
