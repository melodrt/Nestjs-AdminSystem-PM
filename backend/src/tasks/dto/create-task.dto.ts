import { IsString, IsNotEmpty, IsInt, MinLength, MaxLength, IsOptional, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  assignedTo?: number;
}

export class UpdateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['todo', 'in-progress', 'done'])
  @IsOptional()
  status?: 'todo' | 'in-progress' | 'done';

  @IsInt()
  @IsOptional()
  assignedTo?: number;
}

