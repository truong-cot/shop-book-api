import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { GENDER } from 'src/configs/enum';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống!' })
  name: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ enum: GENDER })
  @IsEnum(GENDER, { message: 'Giới tính không hợp lệ!' })
  gender: GENDER;

  @ApiProperty({ example: '1990-05-12' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Ngày sinh phải có định dạng YYYY-MM-DD!',
  })
  birthday: string;

  @ApiProperty({ example: 'Tác giả chuyên viết tiểu thuyết.' })
  @IsString()
  @IsOptional()
  description?: string;
}
