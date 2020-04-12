import { IsString, IsDefined } from 'class-validator';

export class WorkspaceCreateDto {
  @IsDefined()
  @IsString()
  name: string;

  userId?: number;
}