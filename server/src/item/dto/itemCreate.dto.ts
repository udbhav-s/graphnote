import { IsDefined, IsString, IsOptional, IsUrl, IsNumber } from 'class-validator';

export class ItemCreateDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  body: string;

  @IsDefined()
  @IsNumber()
  workspaceId: number;
}