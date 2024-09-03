import { Body, Controller, Get, NotFoundException, Param, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import ImageModel from './image.model';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ImageDto, ImageSummaryDto } from './image.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  @Get('/')
  @ApiResponse({ type: ImageSummaryDto, isArray: true })
  async getImages(): Promise<ImageSummaryDto[]> {
    const images = await ImageModel.findAll();
    return images.map(image => ({
      id: image.id,
      name: image.name,
      size: image.data.length,
      mimetype: image.mimetype
    }));
  }

  @Get('/:id')
  async getImage(@Param('id') id: string) {
    const image = await ImageModel.findByPk(id);
    if (image == null) {
      throw new NotFoundException();
    }
    return new StreamableFile(image.data, { type: image.mimetype });
  }

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Body() data: ImageDto, @UploadedFile('file') file: Express.Multer.File) {
    const image = new ImageModel({
      name: data.name,
      mimetype: file.mimetype,
      data: file.buffer
    });
    await image.save();
    return {
      id: image.id,
      name: image.name
    };
  }

}
