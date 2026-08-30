import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Multer } from 'multer';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
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
