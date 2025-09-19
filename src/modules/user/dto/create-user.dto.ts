import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GENDER } from 'src/configs/enum';

export class CreateUserDto {
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

  @ApiProperty({ example: 'truongdb' })
  @IsString()
  @IsNotEmpty({ message: 'Tài khoản đăng nhập không được để trống!' })
  username: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống!' })
  password: string;
}
