import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '../author/entities/author.entity';
import { MongoRepository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { PublishingHouse } from '../publishing-house/entities/publishing-house.entity';
import { BaseResponseData } from 'src/common/response.helper';
import { RESPONSE_CODE } from 'src/configs/enum';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: MongoRepository<Author>,

    @InjectRepository(Category)
    private readonly categoryRepository: MongoRepository<Category>,

    @InjectRepository(PublishingHouse)
    private readonly publishingHouseRepository: MongoRepository<PublishingHouse>,
  ) {}

  async getCatalogAuthor() {
    try {
      const authors = await this.authorRepository.find({
        select: ['_id', 'name'],
      });

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công!',
        data: authors,
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

  async getCatalogCategory() {
    try {
      const categorys = await this.categoryRepository.find({
        select: ['_id', 'name'],
      });

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công!',
        data: categorys,
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

  async getCatalogPublishingHouse() {
    try {
      const publishingHouses = await this.publishingHouseRepository.find({
        select: ['_id', 'name'],
      });

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công!',
        data: publishingHouses,
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
