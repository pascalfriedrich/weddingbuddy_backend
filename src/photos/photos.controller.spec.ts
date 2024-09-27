import { Test, TestingModule } from '@nestjs/testing';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { ConfigService } from '@nestjs/config';

describe('PhotosController', () => {
  let controller: PhotosController;
  let configService: ConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotosController],
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

    controller = module.get<PhotosController>(PhotosController);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(configService).toBeDefined();
  });
});
