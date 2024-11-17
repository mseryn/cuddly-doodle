import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class Task {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsBoolean()
  isCompleted: boolean;

  @ApiProperty()
  @IsObject()
  due?: {
    date: string;
    string: string;
    lang?: string;
    isRecurring: boolean;
  };

  @ApiProperty()
  @IsArray()
  labels: Array<string>;

  @ApiProperty()
  @IsNumber()
  priority: number;

  @ApiProperty()
  @IsNumber()
  commentCount: number;

  @ApiProperty()
  @IsString()
  createdAt: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  creatorId: string;
}
