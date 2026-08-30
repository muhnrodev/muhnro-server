import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Multer } from 'multer';
import type { Response } from 'express';
import { Readable } from 'stream';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  async getMediaById(@Param('id') mediaId: string, @Res() res: Response) {
    const { media, object } = await this.mediaService.getMediaById(mediaId);

    res.setHeader('Content-Type', media.mimeType);

    if (object.ContentLength) {
      res.setHeader('Content-Length', object.ContentLength);
    }

    if (object.CacheControl) {
      res.setHeader('Cache-Control', object.CacheControl);
    }

    if (object.Body instanceof Readable) {
      return object.Body.pipe(res);
    }

    throw new NotFoundException('Media content not found');
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Body() data: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const user = req.user.id;
    return this.mediaService.createMedia(data, file, user);
  }
}
