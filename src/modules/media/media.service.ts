import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AwsService } from 'src/infrastructure/aws.service';
import { UploadFileDto } from './media.dto';
import { createHash, randomUUID } from 'crypto';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  private readonly bucketName: string;
  private readonly region: string;
  private readonly backendUrl: string;

  constructor(
    private readonly aws: AwsService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME') || '';
    this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.backendUrl = this.configService.get<string>('BACKEND_URL') || '';
  }

  async getMediaById(mediaId: string) {
    try {
      const media = await this.prisma.media.findUnique({
        where: {
          id: mediaId,
        },
      });

      if (!media) {
        this.logger.warn(`Media with ID "${mediaId}" not found`);
        throw new NotFoundException('Media not found');
      }

      const object = await this.aws.getObject(media.path);

      return {
        media,
        object,
      };
    } catch (error) {
      this.logger.error('Error fetching media by ID', error);
      throw error;
    }
  }

  async getMediaContentById(mediaId: string) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      this.logger.warn(`Media with ID "${mediaId}" not found`);
      throw new NotFoundException('Media not found');
    }

    return {
      id: media.id,
      filename: media.filename,
      originalName: media.originalName,
      url: media.url,
      mimeType: media.mimeType,
      extension: media.extension,
      size: media.size,
    };
  }

  async getMediaUrl(mediaId: string) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return this.aws.getSignedUrl(media.path);
  }

  async createMedia(
    data: UploadFileDto,
    file: Express.Multer.File,
    user: string,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const upload = await this.uploadFile(data, file);
      const metadata = await this.getMediaMetadata(file);

      const url = `${this.backendUrl}/media/${upload.id}`;

      const media = await this.prisma.media.create({
        data: {
          id: upload.id,
          filename: upload.fileName,
          originalName: upload.originalName,
          path: upload.key,
          bucket: this.bucketName,
          mimeType: upload.type,
          extension: upload.extension,
          size: upload.size,
          type: data.type,
          createById: user,
          url: url,
          width: metadata.width,
          height: metadata.height,
          duration: metadata.duration,
          checksum: metadata.checksum,
          altText: data.altText,
          caption: data.caption,
        },
      });

      return {
        message: 'Media uploaded successfully',
        media: {
          id: media.id,
          filename: media.filename,
          originalName: media.originalName,
          url: media.url,
        },
      };
    } catch (error) {
      this.logger.error('Error creating media', error);
      throw error;
    }
  }

  async uploadFile(data: UploadFileDto, file: Express.Multer.File) {
    try {
      const fileId = randomUUID();
      const fileExtension = path.extname(file.originalname);
      const baseName = data.fileName || fileId;
      const fileName = `${baseName}${fileExtension}`;
      const folderPath = data.folderPath || 'default';
      const s3Key = `${folderPath}/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
        },
      });

      await this.aws.s3Client.send(command);

      return {
        id: fileId,
        fileName: fileName,
        originalName: file.originalname,
        key: s3Key,
        size: file.size,
        type: file.mimetype,
        extension: fileExtension,
      };
    } catch (error) {
      this.logger.error('Error uploading file to S3', error);
      throw error;
    }
  }

  private async getMediaMetadata(file: Express.Multer.File) {
    const metadata: {
      width?: number;
      height?: number;
      duration?: number;
      checksum?: string;
    } = {};

    metadata.checksum = createHash('sha256').update(file.buffer).digest('hex');

    if (file.mimetype.startsWith('image/')) {
      const imageMetadata = await sharp(file.buffer).metadata();

      metadata.width = imageMetadata.width;
      metadata.height = imageMetadata.height;
    }

    return metadata;
  }
}
