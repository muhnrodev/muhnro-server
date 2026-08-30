import { Global, Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { SESClient } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';

@Global()
@Injectable()
export class AwsService {
  public readonly s3Client: S3Client;
  public readonly sesClient: SESClient;

  constructor(private readonly configService: ConfigService) {
    const credentials = {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
      secretAccessKey:
        this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
    };

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials,
    });

    this.sesClient = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials,
    });
  }
}
