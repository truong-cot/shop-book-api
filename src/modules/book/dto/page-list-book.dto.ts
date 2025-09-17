import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PageListBookDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  pageSize: number;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword: string;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  author_id: string;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  category_id: string;

  @ApiProperty({
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  publishing_house_id: string;
}
