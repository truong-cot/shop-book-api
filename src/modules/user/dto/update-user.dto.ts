import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { GENDER } from 'src/configs/enum';

export class UpdateUserDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty({ message: 'ID không được để trống!' })
  @IsObjectId({ message: 'ID không hợp lệ!' })
  _id: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống!' })
  fullName: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty({ message: 'Ảnh đại diện không được để trống!' })
  avatar: string;

  @ApiProperty({ enum: GENDER })
  @IsEnum(GENDER, { message: 'Giới tính không hợp lệ!' })
  gender: GENDER;
}
