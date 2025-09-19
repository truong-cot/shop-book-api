import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangePasswordUserDto } from './dto/change-pass-user.dto';
import { DetailUserDto } from './dto/detail-user.dto';

@ApiTags('User (Người dùng)')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo mới người dùng' })
  create(@Body() request: CreateUserDto) {
    return this.userService.create(request);
  }

  @Post('update')
  @ApiOperation({ summary: 'Chỉnh sửa người dùng' })
  update(@Body() request: UpdateUserDto) {
    return this.userService.update(request);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu người dùng' })
  changePassword(@Body() request: ChangePasswordUserDto) {
    return this.userService.changePassword(request);
  }

  @Get('detail/:_id')
  @ApiOperation({ summary: 'Chi tiết người dùng' })
  detail(@Param() params: DetailUserDto) {
    return this.userService.detail(params);
  }

  @Delete('delete/:_id')
  @ApiOperation({ summary: 'Xóa người dùng' })
  delete(@Param() params: DetailUserDto) {
    return this.userService.delete(params);
  }
}
