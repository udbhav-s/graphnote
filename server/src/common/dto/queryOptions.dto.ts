import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryOptionsDto {
  @IsOptional()
  @IsEnum(['createdAt', 'name'])
  orderBy?: string;

  @IsOptional()
  @Transform(s => s.toLowerCase())
  @IsEnum(['asc', 'desc'])
  order?: string;

  @IsOptional()
  @IsInt()
  @Transform(val => parseInt(val))
  limit?: number;

  @IsOptional()
  @IsInt()
  @Transform(val => parseInt(val))
  offset?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
