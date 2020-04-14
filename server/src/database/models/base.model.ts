import { Model, QueryBuilder, OrderByDirection } from 'objection';
import { QueryOptionsDto } from 'src/common/dto/queryOptions.dto';

export class BaseModel extends Model {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;

  static modifiers = {
    queryOptions(query: QueryBuilder<BaseModel>, options: QueryOptionsDto) {
      if (options.limit) query.limit(options.limit);
      if (options.offset) query.offset(options.offset);
      // order options
      if (options.orderBy && options.order) {
        query.orderBy(options.orderBy, options.order as OrderByDirection);
      }
    },
  }
}
