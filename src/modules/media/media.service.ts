import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AwsService } from 'src/infrastructure/aws.service';
import { UploadFileDto } from './media.dto';
import { createHash, randomUUID } from 'crypto';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/generated/prisma/client';
import sharp from 'sharp';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  private readonly bucketName: string;
  private readonly region: string;
  constructor(
    private readonly aws: AwsService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME') || '';
    this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
  }

  async createMedia(
    data: UploadFileDto,
    file: Express.Multer.File,
    user: User,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const upload = await this.uploadFile(data, file);
      const metadata = await this.getMediaMetadata(file);

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
          createById: user.id,
          url: upload.url,
          width: metadata.width,
          height: metadata.height,
          duration: metadata.duration,
          checksum: metadata.checksum,
          altText: data.altText,
          caption: data.caption,
        },
      });

      return media;
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

      const bucket = this.bucketName;
      const region = this.region;
      const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;

      return {
        id: fileId,
        fileName: fileName,
        originalName: file.originalname,
        key: s3Key,
        url: fileUrl,
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
