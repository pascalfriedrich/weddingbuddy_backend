import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class PhotosService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    const spacesEndpoint = new AWS.Endpoint(
      this.configService.get<string>('digitalOcean.spaces.endpoint'),
    );
    this.s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileContent = file.buffer;
    const params = {
      Bucket: this.configService.get<string>('digitalOcean.spaces.bucket'),
      Key: file.originalname,
      Body: fileContent,
      ACL: 'public-read',
    };

    const data = await this.s3.upload(params).promise();
    return data.Location;
  }
}
