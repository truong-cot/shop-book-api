import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { TYPE_BOOK } from 'src/configs/enum';

export class CreateBookDto {
  @ApiProperty({ example: '', description: 'Tên sách' })
  @IsString()
  @IsNotEmpty({ message: 'Tên sách không được để trống!' })
  name: string;

  @ApiProperty({ example: '', description: 'Ảnh bìa sách' })
  @IsString()
  @IsNotEmpty({ message: 'Ảnh bìa không được để trống!' })
  thumbnail: string;

  @ApiProperty({ description: 'Giá sách' })
  @IsNumber()
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0!' })
  price: number;

  @ApiProperty({ example: '1990-05-12', description: 'Ngày xuất bản' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Ngày xuất bản phải có định dạng YYYY-MM-DD!',
  })
  publishedDate: string;

  @ApiProperty({ description: 'Số trang' })
  @IsNumber()
  @Min(0, { message: 'Số trang lớn hơn hoặc bằng 0!' })
  pageCount: number;

  @ApiProperty({ description: 'Cân nặng (g)' })
  @IsNumber()
  @Min(0, { message: 'Cân nặng lớn hơn hoặc bằng 0!' })
  weight: number;

  @ApiProperty({ description: 'Chiều dài (cm)' })
  @IsNumber()
  @Min(0, { message: 'Chiều dài lớn hơn hoặc bằng 0!' })
  length: number;

  @ApiProperty({ description: 'Chiều rộng (cm)' })
  @IsNumber()
  @Min(0, { message: 'Chiều rộng lớn hơn hoặc bằng 0!' })
  width: number;

  @ApiProperty({ description: 'Chiều cao (cm)' })
  @IsNumber()
  @Min(0, { message: 'Chiều cao lớn hơn hoặc bằng 0!' })
  height: number;

  @ApiProperty({
    enum: TYPE_BOOK,
    description: 'Loại sách (1: Bìa cứng - 2: Bìa mềm)',
  })
  @IsEnum(TYPE_BOOK, { message: 'Loại sách không hợp lệ!' })
  type: TYPE_BOOK;

  @ApiProperty({ description: 'ID thể loại', example: '' })
  @IsString()
  @IsNotEmpty({ message: 'ID thể loại không được để trống!' })
  @IsObjectId({ message: 'ID thể loại không hợp lệ!' })
  category_id: string;

  @ApiProperty({ description: 'ID tác giả', example: '' })
  @IsString()
  @IsNotEmpty({ message: 'ID tác giả không được để trống!' })
  @IsObjectId({ message: 'ID tác giả không hợp lệ!' })
  author_id: string;

  @ApiProperty({ description: 'ID nhà xuất bản', example: '' })
  @IsString()
  @IsNotEmpty({ message: 'ID nhà xuất bản không được để trống!' })
  @IsObjectId({ message: 'ID nhà xuất bản không hợp lệ!' })
  publishing_house_id: string;
}
