import { IsDefined, IsString, IsInt } from 'class-validator';

export class WorkspaceUserDto {
  @IsDefined()
  @IsInt()
  workspaceId: number;

  @IsDefined()
  @IsString()
  username: string;
}
