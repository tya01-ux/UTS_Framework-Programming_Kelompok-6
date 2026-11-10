import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'TeamFlow Website' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Project kolaborasi mahasiswa' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ACTIVE })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({ example: '2026-11-09' })
  @IsDateString()
  start_date: string;

  @ApiPropertyOptional({ example: '2026-12-30' })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}