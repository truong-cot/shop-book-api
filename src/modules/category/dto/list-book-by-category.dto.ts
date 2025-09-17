import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class ListBookByCategoryDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty({ message: 'ID không được để trống!' })
  @IsObjectId({ message: 'ID không hợp lệ!' })
  category_id: string;

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
}
