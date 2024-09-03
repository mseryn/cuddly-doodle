import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class userDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsArray()
  TaskDefinitions: string[];
}