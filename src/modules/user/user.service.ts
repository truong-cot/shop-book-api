import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongoRepository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseResponseData } from 'src/common/response.helper';
import { RESPONSE_CODE } from 'src/configs/enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongodb';
import { ChangePasswordUserDto } from './dto/change-pass-user.dto';
import { DetailUserDto } from './dto/detail-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  async create(request: CreateUserDto) {
    try {
      const existedUserName = await this.userRepository.findOne({
        where: { username: new RegExp(`^${request.username}$`, 'i') },
      });

      if (existedUserName) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Tài khoản đăng nhập đã tồn tại',
          data: null,
        });
      }

      const newUser = this.userRepository.create({
        fullName: request.fullName,
        avatar: request.avatar,
        gender: request.gender,
        username: request.username,
        password: request.password,
      });

      const saved = await this.userRepository.save(newUser);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thêm người dùng thành công!',
        data: saved,
      });
    } catch (error) {
      console.log('Error', error);

      return BaseResponseData({
        code: RESPONSE_CODE.ERROR,
        message: 'Có lỗi xảy ra, vui lòng thử lại!',
        data: null,
      });
    }
  }

  async update(request: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!user) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Người dùng không tồn tại',
          data: null,
        });
      }

      this.userRepository.merge(user, {
        fullName: request.fullName,
        avatar: request.avatar,
        gender: request.gender,
      });

      const updated = await this.userRepository.save(user);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Cập nhật người dùng thành công',
        data: updated,
      });
    } catch (error) {
      console.log('Error', error);

      return BaseResponseData({
        code: RESPONSE_CODE.ERROR,
        message: 'Có lỗi xảy ra, vui lòng thử lại!',
        data: null,
      });
    }
  }

  async changePassword(request: ChangePasswordUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!user) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Người dùng không tồn tại',
          data: null,
        });
      }

      if (request.oldPassword != user.password) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Mật khẩu cũ không chính xác',
          data: null,
        });
      }

      this.userRepository.merge(user, {
        password: request.newPassword,
      });

      const updated = await this.userRepository.save(user);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thay đổi mật khẩu thành công',
        data: updated,
      });
    } catch (error) {
      console.log('Error', error);

      return BaseResponseData({
        code: RESPONSE_CODE.ERROR,
        message: 'Có lỗi xảy ra, vui lòng thử lại!',
        data: null,
      });
    }
  }

  async detail(request: DetailUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!user) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Người không tồn tại',
          data: null,
        });
      }

      const { password, ...rest } = user;

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công',
        data: rest,
      });
    } catch (error) {
      console.log('Error', error);

      return BaseResponseData({
        code: RESPONSE_CODE.ERROR,
        message: 'Có lỗi xảy ra, vui lòng thử lại!',
        data: null,
      });
    }
  }

  async delete(request: DeleteUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!user) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Người dùng không tồn tại',
          data: null,
        });
      }

      await this.userRepository.delete({ _id: new ObjectId(request._id) });

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công',
        data: null,
      });
    } catch (error) {
      console.log('Error', error);

      return BaseResponseData({
        code: RESPONSE_CODE.ERROR,
        message: 'Có lỗi xảy ra, vui lòng thử lại!',
        data: null,
      });
    }
  }
}
