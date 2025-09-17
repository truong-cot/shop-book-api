import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { MongoRepository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { BaseResponseData } from 'src/common/response.helper';
import { RESPONSE_CODE } from 'src/configs/enum';
import { Author } from '../author/entities/author.entity';
import { Category } from '../category/entities/category.entity';
import { PublishingHouse } from '../publishing-house/entities/publishing-house.entity';
import { ObjectId } from 'mongodb';
import { UpdateBookDto } from './dto/update-book.dto';
import { DeleteBookDto } from './dto/delete-book.dto';
import { DetailBookDto } from './dto/detail-book.dto';
import { PageListBookDto } from './dto/page-list-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: MongoRepository<Book>,

    @InjectRepository(Author)
    private readonly authorRepository: MongoRepository<Author>,

    @InjectRepository(Category)
    private readonly categoryRepository: MongoRepository<Category>,

    @InjectRepository(PublishingHouse)
    private readonly publishingHouseRepository: MongoRepository<PublishingHouse>,
  ) {}

  async create(request: CreateBookDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { _id: new ObjectId(request.category_id) },
      });

      if (!category) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Thể loại không tồn tại!',
          data: null,
        });
      }

      const author = await this.authorRepository.findOne({
        where: { _id: new ObjectId(request.author_id) },
      });

      if (!author) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Tác giả không tồn tại!',
          data: null,
        });
      }

      const publishingHouse = await this.publishingHouseRepository.findOne({
        where: { _id: new ObjectId(request.publishing_house_id) },
      });
      if (!publishingHouse) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Nhà xuất bản không tồn tại!',
          data: null,
        });
      }

      const existedName = await this.bookRepository.findOne({
        where: { name: new RegExp(`^${request.name}$`, 'i') },
      });

      if (existedName) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Tên sách đã tồn tại',
          data: null,
        });
      }

      const newBook = this.bookRepository.create({
        name: request.name,
        thumbnail: request.thumbnail,
        price: request.price,
        pageCount: request.pageCount,
        weight: request.weight,
        length: request.length,
        width: request.width,
        height: request.height,
        type: request.type,
        publishedDate: new Date(request.publishedDate),
        author_id: new ObjectId(request.author_id),
        category_id: new ObjectId(request.category_id),
        publishing_house_id: new ObjectId(request.publishing_house_id),
      });

      const savedBook = await this.bookRepository.save(newBook);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thêm sách thành công!',
        data: savedBook,
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

  async update(request: UpdateBookDto) {
    try {
      const book = await this.bookRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!book) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Sách không tồn tại',
          data: null,
        });
      }

      const category = await this.categoryRepository.findOne({
        where: { _id: new ObjectId(request.category_id) },
      });

      if (!category) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Thể loại không tồn tại!',
          data: null,
        });
      }

      const author = await this.authorRepository.findOne({
        where: { _id: new ObjectId(request.author_id) },
      });

      if (!author) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Tác giả không tồn tại!',
          data: null,
        });
      }

      const publishingHouse = await this.publishingHouseRepository.findOne({
        where: { _id: new ObjectId(request.publishing_house_id) },
      });
      if (!publishingHouse) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Nhà xuất bản không tồn tại!',
          data: null,
        });
      }

      this.bookRepository.merge(book, {
        name: request.name,
        thumbnail: request.thumbnail,
        price: request.price,
        pageCount: request.pageCount,
        weight: request.weight,
        length: request.length,
        width: request.width,
        height: request.height,
        type: request.type,
        publishedDate: new Date(request.publishedDate!),
        author_id: new ObjectId(request.author_id),
        category_id: new ObjectId(request.category_id),
        publishing_house_id: new ObjectId(request.publishing_house_id),
      });

      const updated = await this.bookRepository.save(book);

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Cập nhật sách thành công',
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

  async delete(request: DeleteBookDto) {
    try {
      const book = await this.bookRepository.findOne({
        where: { _id: new ObjectId(request._id) },
      });

      if (!book) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Sách không tồn tại',
          data: null,
        });
      }

      await this.bookRepository.delete({ _id: new ObjectId(request._id) });

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

  async detail(request: DetailBookDto) {
    try {
      const book = await this.bookRepository.findOne({
        where: { _id: new ObjectId(request._id) },
        relations: ['author', 'category', 'publishing_house'],
      });

      if (!book) {
        return BaseResponseData({
          code: RESPONSE_CODE.ERROR,
          message: 'Sách không tồn tại',
          data: null,
        });
      }

      const [author, category, publishingHouse] = await Promise.all([
        this.authorRepository.findOne({
          where: { _id: new ObjectId(book.author_id) },
          select: [
            '_id',
            'name',
            'avatar',
            'birthday',
            'gender',
            'description',
          ],
        }),
        this.categoryRepository.findOne({
          where: {
            _id: new ObjectId(book.category_id),
          },
          select: ['_id', 'name', 'image', 'description'],
        }),
        this.publishingHouseRepository.findOne({
          where: {
            _id: new ObjectId(book.publishing_house_id),
          },
          select: ['_id', 'name', 'description'],
        }),
      ]);

      const { author_id, category_id, publishing_house_id, ...rest } = book;

      return BaseResponseData({
        code: RESPONSE_CODE.SUCCESS,
        message: 'Thành công',
        data: {
          ...rest,
          author,
          category,
          publishingHouse,
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

  async getPageList(request: PageListBookDto) {
    try {
      const {
        page,
        pageSize,
        keyword,
        type,
        author_id,
        category_id,
        publishing_house_id,
      } = request;

      const query: any = {};

      if (keyword) query.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      if (type) query.type = type;
      if (author_id) query.author_id = new ObjectId(author_id);
      if (category_id) query.category_id = new ObjectId(category_id);
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
