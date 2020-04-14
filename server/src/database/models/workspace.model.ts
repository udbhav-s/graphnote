import { BaseModel } from './base.model';
import { Model } from 'objection';
import { UserModel } from './user.model';
import { ItemModel } from './item.model';
import { QueryBuilder } from 'objection';

export class WorkspaceModel extends BaseModel {
  static tableName = 'workspaces';

  name!: string;
  public: boolean;
  userId!: number;

  user: UserModel;
  sharedUsers: UserModel[];
  items: ItemModel[];

  static modifiers = {
    getUsers(query: QueryBuilder<WorkspaceModel>) {
      query
        .withGraphFetched('[user(fields), sharedUsers(fields)]')
        .modifiers({
          fields(builder) {
            builder.select('users.id', 'users.name')
          }
        });
    },

    ...BaseModel.modifiers
  }

  static relationMappings = () => ({
    user: {
      modelClass: UserModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'workspaces.userId',
        to: 'users.id'
      }
    },

    sharedUsers: {
      modelClass: UserModel,
      relation: Model.ManyToManyRelation,
      join: {
        from: 'workspaces.id',
        through: {
          from: 'workspacesUsers.workspaceId',
          to: 'workspacesUsers.userId'
        },
        to: 'users.id'
      }
    },

    items: {
      modelClass: ItemModel,
      relation: Model.HasManyRelation,
      join: {
        from: 'workspaces.id',
        to: 'items.workspaceId'
      }
    }
  });
}
