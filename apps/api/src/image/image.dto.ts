import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';


export class ImageDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File
}

export class ImageSummaryDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  size: number

  @ApiProperty()
  mimetype: string
}