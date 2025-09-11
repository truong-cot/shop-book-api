import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { MongoRepository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { BaseResponseData } from 'src/common/response.helper';
import { RESPONSE_CODE } from 'src/configs/enum';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ObjectId } from 'mongodb';
import { DetailAuthorDto } from './dto/detail-author.dto';
import { PageListAuthorDto } from './dto/page-list-author.dto';
import { DeleteAuthorDto } from './dto/delete-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: MongoRepository<Author>,
  ) {}

  async create(request: CreateAuthorDto) {
    try {
      const newAuthor = this.authorRepository.create({
        ...request,
        birthday: new Date(request.birthday),
      });

      const saved = await this.authorRepository.save(newAuthor);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thêm tác giả thành công!',
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

  async update(request: UpdateAuthorDto) {
    try {
      const author = await this.authorRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!author) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Tác giả không tồn tại!',
          data: null,
        });
      }

      this.authorRepository.merge(author, {
        name: request.name,
        avatar: request.avatar,
        gender: request.gender,
        birthday: request.birthday,
        description: request.description,
      });

      const updated = await this.authorRepository.save(author);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Cập nhật tác giả thành công!',
        data: updated,
      });
    } catch (error) {
      console.error('Error:', error);

      return BaseResponseData({
        code: RESPONSE_CODE.ERROR,
        message: 'Có lỗi xảy ra, vui lòng thử lại!',
        data: null,
      });
    }
  }

  async detail(request: DetailAuthorDto) {
    try {
      const author = await this.authorRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!author) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Tác giả không tồn tại',
          data: null,
        });
      }

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công',
        data: author,
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

  async getPageList(request: PageListAuthorDto) {
    try {
      const { page, pageSize, keyword } = request;

      const query: any = {};

      if (keyword) {
        query.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      }

      const [items, total] = await this.authorRepository.findAndCount({
        where: query,
        take: pageSize,
        skip: (page - 1) * pageSize,
        select: [
          '_id',
          'name',
          'avatar',
          'gender',
          'description',
          'birthday',
          'createdAt',
          'updatedAt',
        ],
        relations: [],
      });

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công!',
        data: {
          items: items,
          pagination: {
            currentPage: page,
            totalCount: total,
          },
        },
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

  async delete(request: DeleteAuthorDto) {
    try {
      const author = await this.authorRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!author) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Tác giả không tồn tại',
          data: null,
        });
      }

      await this.authorRepository.delete({ _id: new ObjectId(request._id) });

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
