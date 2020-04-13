import { IsString, IsDefined, IsInt } from "class-validator";

export class TagCreateDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsInt()
  workspaceId: number;
}