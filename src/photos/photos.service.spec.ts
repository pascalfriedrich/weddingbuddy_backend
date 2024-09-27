import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

describe('PhotosService', () => {
  let service: PhotosService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'digitalOcean.spaces.endpoint') {
                return 'https://example.com';
              }
              if (key === 'digitalOcean.spaces.body') {
                return 'testbody';
              }
              if (key === 'digitalOcean.spaces.bucket') {
                return 'testbucket';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload an image and return the URL', async () => {
      const mockFile = {
        path: 'test/path/to/file.jpg',
        originalname: 'file.jpg',
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const mockUpload = jest
        .spyOn(AWS.S3.prototype, 'upload')
        .mockReturnValue({
          promise: jest
            .fn()
            .mockResolvedValue({ Location: 'https://example.com/file.jpg' }),
        } as any);

      const result = await service.uploadImage(mockFile);

      expect(mockUpload).toHaveBeenCalledWith({
        Bucket: 'testbucket',
        Key: mockFile.originalname,
        Body: Buffer.from('file content'),
        ACL: 'public-read',
      });
      expect(result).toBe('https://example.com/file.jpg');

      mockUpload.mockRestore();
    });
  });
});
