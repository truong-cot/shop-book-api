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
import { ListBookByAuthorDto } from './dto/list-book-by-author.dto';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: MongoRepository<Author>,

    @InjectRepository(Book)
    private bookRepository: MongoRepository<Book>,
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

      const [items, total] = await Promise.all([
        this.authorRepository
          .aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },

            // Join sang collection book
            {
              $lookup: {
                from: '_tb_book',
                localField: '_id',
                foreignField: 'author_id',
                as: 'books',
              },
            },

            // Đếm số lượng sách
            {
              $addFields: {
                bookCount: { $size: '$books' },
              },
            },

            // Chỉ lấy field cần thiết
            {
              $project: {
                _id: 1,
                name: 1,
                avatar: 1,
                gender: 1,
                birthday: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                bookCount: 1,
              },
            },
          ])
          .toArray(),
        this.authorRepository.count(query),
      ]);

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

  async listBookByAuthor(request: ListBookByAuthorDto) {
    try {
      const { author_id, page, pageSize, keyword } = request;

      const query: any = {};

      if (keyword) query.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      if (author_id) query.author_id = new ObjectId(author_id);

      const [items, total] = await Promise.all([
        this.bookRepository
          .aggregate([
            {
              $match: query,
            },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $lookup: {
                from: '_tb_author',
                localField: 'author_id',
                foreignField: '_id',
                as: 'author',
              },
            },
            { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: '_tb_category',
                localField: 'category_id',
                foreignField: '_id',
                as: 'category',
              },
            },
            {
              $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: '_tb_publishing_house',
                localField: 'publishing_house_id',
                foreignField: '_id',
                as: 'publishingHouse',
              },
            },
            {
              $unwind: {
                path: '$publishingHouse',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                thumbnail: 1,
                price: 1,
                publishedDate: 1,
                pageCount: 1,
                weight: 1,
                length: 1,
                width: 1,
                height: 1,
                type: 1,
                createdAt: 1,
                updatedAt: 1,
                author: {
                  _id: 1,
                  name: 1,
                  avatar: 1,
                  gender: 1,
                  birthday: 1,
                  description: 1,
                },
                category: { _id: 1, name: 1, image: 1, description: 1 },
                publishingHouse: { _id: 1, name: 1, description: 1 },
              },
            },
          ])
          .toArray(),

        this.bookRepository.count(query),
      ]);

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
}
