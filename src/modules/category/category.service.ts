import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { MongoRepository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BaseResponseData } from 'src/common/response.helper';
import { RESPONSE_CODE } from 'src/configs/enum';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ObjectId } from 'mongodb';
import { DetailCategoryDto } from './dto/detail-category.dto';
import { PageListCategoryDto } from './dto/page-list-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: MongoRepository<Category>,
  ) {}

  async create(request: CreateCategoryDto) {
    try {
      const existedName = await this.categoryRepository.findOne({
        where: { name: new RegExp(`^${request.name}$`, 'i') },
      });

      if (existedName) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Tên thể loại đã tồn tại',
          data: null,
        });
      }

      const newCategory = this.categoryRepository.create({
        name: request.name,
        image: request.image,
        description: request.description,
      });

      const result = await this.categoryRepository.save(newCategory);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Tạo thể loại thành công',
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

  async update(request: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!category) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Thể loại không tồn tại',
          data: null,
        });
      }

      this.categoryRepository.merge(category, {
        name: request.name,
        image: request.image,
        description: request.description,
      });

      const updated = await this.categoryRepository.save(category);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Cập nhật thể loại thành công',
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

  async detail(request: DetailCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!category) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Thể loại không tồn tại',
          data: null,
        });
      }

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công',
        data: category,
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

  async getPageList(request: PageListCategoryDto) {
    try {
      const { page, pageSize, keyword } = request;

      const query: any = {};

      if (keyword) {
        query.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      }

      const [items, total] = await this.categoryRepository.findAndCount({
        where: query,
        take: pageSize,
        skip: (page - 1) * pageSize,
        select: [
          '_id',
          'name',
          'image',
          'description',
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

  async delete(request: DeleteCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!category) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Thể loại không tồn tại',
          data: null,
        });
      }

      await this.categoryRepository.delete({ _id: new ObjectId(request._id) });

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
