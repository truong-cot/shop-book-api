import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Tên thể loại không được để trống' })
  @Length(3, 50, { message: 'Tên thể loại phải từ 3 đến 50 ký tự' })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Hình ảnh thể loại không được để trống' })
  image: string;

  @ApiProperty()
  @IsString()
  description: string;
}
