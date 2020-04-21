import { IsString, IsDefined, IsOptional, IsBoolean } from 'class-validator';

export class WorkspaceCreateDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  public: boolean;

  userId?: number;
}
