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

@Injectable()
export class PublishingHouseService {
  constructor(
    @InjectRepository(PublishingHouse)
    private publishingHouseRepository: MongoRepository<PublishingHouse>,
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

      const [items, total] = await this.publishingHouseRepository.findAndCount({
        where: query,
        take: pageSize,
        skip: (page - 1) * pageSize,
        select: ['_id', 'name', 'description', 'createdAt', 'updatedAt'],
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
}
