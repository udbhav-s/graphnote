import { IsDefined, IsString, IsOptional, IsUrl, IsInt } from 'class-validator';

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

  @IsInt()
  workspaceId: number;
}
