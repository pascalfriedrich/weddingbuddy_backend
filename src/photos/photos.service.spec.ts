import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

describe('PhotosService', () => {
  let service: PhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotosService],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload an image and return the URL', async () => {
      const mockFile = {
        path: 'test/path/to/file.jpg',
      } as Express.Multer.File;

      const mockReadFileSync = jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue(Buffer.from('file content'));
      const mockUpload = jest
        .spyOn(AWS.S3.prototype, 'upload')
        .mockReturnValue({
          promise: jest
            .fn()
            .mockResolvedValue({ Location: 'https://example.com/file.jpg' }),
        } as any);

      const result = await service.uploadImage(mockFile);

      expect(mockReadFileSync).toHaveBeenCalledWith(mockFile.path);
      expect(mockUpload).toHaveBeenCalledWith({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: path.basename(mockFile.path),
        Body: Buffer.from('file content'),
        ACL: 'public-read',
      });
      expect(result).toBe('https://example.com/file.jpg');

      mockReadFileSync.mockRestore();
      mockUpload.mockRestore();
    });
  });
});
