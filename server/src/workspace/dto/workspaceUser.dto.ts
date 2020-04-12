import { IsDefined, IsNumber, IsString } from 'class-validator';

export class WorkspaceUserDto {
  @IsDefined()
  @IsNumber()
  workspaceId: number;

  @IsDefined()
  @IsString()
  username: string;
}