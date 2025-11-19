import { IsString, IsNotEmpty, IsInt, MinLength, MaxLength, IsOptional, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsInt()
  @IsNotEmpty()
  workspaceId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;
}

export class UpdateProjectDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['active', 'archived', 'completed'])
  @IsOptional()
  status?: 'active' | 'archived' | 'completed';
}

