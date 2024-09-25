import { ApiProperty } from '@nestjs/swagger';

export class CreatePhotoDto {
  @ApiProperty({
    example: 'Photo title',
    description: 'The title of the photo',
  })
  title: string;

  @ApiProperty({
    example: 'Photo description',
    description: 'The description of the photo',
  })
  description: string;
}
