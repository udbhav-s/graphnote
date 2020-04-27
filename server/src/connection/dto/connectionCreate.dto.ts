import {
  IsDefined,
  IsString,
  IsInt,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class ConnectionCreateDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  url: string;

  @IsInt()
  item1Id: number;

  @IsInt()
  item2Id: number;

  @IsOptional()
  @IsString({ each: true })
  tags: any[]; // reassigned as relation expression by controller

  metadataId: number;
}
