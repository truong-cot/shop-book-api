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
import { Book } from '../book/entities/book.entity';
import { ListBookByCategoryDto } from './dto/list-book-by-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: MongoRepository<Category>,

    @InjectRepository(Book)
    private bookRepository: MongoRepository<Book>,
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

      const [items, total] = await Promise.all([
        this.categoryRepository
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
                foreignField: 'category_id',
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
                image: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                bookCount: 1,
              },
            },
          ])
          .toArray(),

        this.categoryRepository.count(query),
      ]);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công!',
        data: {
          items,
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

  async listBookByCategory(request: ListBookByCategoryDto) {
    try {
      const { category_id, page, pageSize, keyword } = request;

      const query: any = {};

      if (keyword) query.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      if (category_id) query.category_id = new ObjectId(category_id);

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
