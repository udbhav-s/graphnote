import { IsDefined, IsString, ValidateNested, ValidateIf, IsInt, IsOptional, IsUrl } from 'class-validator';
import { ItemCreateDto } from 'src/item/dto/itemCreate.dto';
import { Type } from 'class-transformer';

export class ConnectionCreateDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  url: string;

  @ValidateIf(o => !o.item1Id)
  @ValidateNested()
  @Type(() => ItemCreateDto)
  item1: ItemCreateDto;

  @ValidateIf(o => !o.item1)
  @IsInt()
  item1Id: number;

  @ValidateIf(o => !o.item2Id)
  @ValidateNested()
  @Type(() => ItemCreateDto)
  item2: ItemCreateDto;

  @ValidateIf(o => !o.item2)
  @IsInt()
  item2Id: number;
}