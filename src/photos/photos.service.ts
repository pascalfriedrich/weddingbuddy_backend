import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PhotosService {
  private s3: AWS.S3;

  constructor() {
    const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
    this.s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileContent = fs.readFileSync(file.path);
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: path.basename(file.path),
      Body: fileContent,
      ACL: 'public-read',
    };

    const data = await this.s3.upload(params).promise();
    return data.Location;
  }
}
