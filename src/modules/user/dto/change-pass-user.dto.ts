import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { GENDER } from 'src/configs/enum';

export class ChangePasswordUserDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty({ message: 'ID không được để trống!' })
  @IsObjectId({ message: 'ID không hợp lệ!' })
  _id: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống!' })
  oldPassword: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống!' })
  newPassword: string;
}
