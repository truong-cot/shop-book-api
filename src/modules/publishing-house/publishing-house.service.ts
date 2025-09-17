import { Injectable } from '@nestjs/common';
import { CreatePublishingHouseDto } from './dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from './dto/update-publishing-house.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PublishingHouse } from './entities/publishing-house.entity';
import { MongoRepository } from 'typeorm';
import { BaseResponseData } from 'src/common/response.helper';
import { RESPONSE_CODE } from 'src/configs/enum';
import { ObjectId } from 'mongodb';
import { DetailPublishingHouseDto } from './dto/detail-publishing-house.dto';
import { PageListPublishingHouseDto } from './dto/page-list-publishing-house.dto';
import { DeletePublishingHouseDto } from './dto/delete-publishing-house.dto';
import { Book } from '../book/entities/book.entity';
import { ListBookByPublishingouseDto } from './dto/list-book-by-publishing-house.dto';

@Injectable()
export class PublishingHouseService {
  constructor(
    @InjectRepository(PublishingHouse)
    private publishingHouseRepository: MongoRepository<PublishingHouse>,

    @InjectRepository(Book)
    private bookRepository: MongoRepository<Book>,
  ) {}

  async create(request: CreatePublishingHouseDto) {
    try {
      const existedName = await this.publishingHouseRepository.findOne({
        where: { name: new RegExp(`^${request.name}$`, 'i') },
      });

      if (existedName) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Tên nhà xuất bản đã tồn tại',
          data: null,
        });
      }

      const newPublishingHouse = this.publishingHouseRepository.create({
        name: request.name,
        description: request.description,
      });

      const result =
        await this.publishingHouseRepository.save(newPublishingHouse);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Tạo nhà xuất bản thành công',
        data: result,
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

  async update(request: UpdatePublishingHouseDto) {
    try {
      const publishingHouse = await this.publishingHouseRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!publishingHouse) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Nhà xuất bản không tồn tại',
          data: null,
        });
      }

      this.publishingHouseRepository.merge(publishingHouse, {
        name: request.name,
        description: request.description,
      });

      const updated =
        await this.publishingHouseRepository.save(publishingHouse);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Cập nhật nhà xuất bản thành công',
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

  async detail(request: DetailPublishingHouseDto) {
    try {
      const publishingHouse = await this.publishingHouseRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!publishingHouse) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Nhà xuất bản không tồn tại',
          data: null,
        });
      }

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công',
        data: publishingHouse,
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

  async getPageList(request: PageListPublishingHouseDto) {
    try {
      const { page, pageSize, keyword } = request;

      const query: any = {};

      if (keyword) {
        query.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      }

      const [items, total] = await Promise.all([
        this.publishingHouseRepository
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
                foreignField: 'publishing_house_id',
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
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                bookCount: 1,
              },
            },
          ])
          .toArray(),

        this.publishingHouseRepository.count(query),
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

  async delete(request: DeletePublishingHouseDto) {
    try {
      const publishingHouse = await this.publishingHouseRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!publishingHouse) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Nhà xuất bản không tồn tại',
          data: null,
        });
      }

      await this.publishingHouseRepository.delete({
        _id: new ObjectId(request._id),
      });

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

  async listBookByPublishingHouse(request: ListBookByPublishingouseDto) {
    try {
      const { publishing_house_id, page, pageSize, keyword } = request;

      const query: any = {};

      if (keyword) query.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      if (publishing_house_id)
        query.publishing_house_id = new ObjectId(publishing_house_id);

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
