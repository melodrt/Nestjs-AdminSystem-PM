import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;
}

export class UpdateWorkspaceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsString()
  @MaxLength(500)
  description?: string;
}

