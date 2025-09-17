import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { Category } from '../category/entities/category.entity';
import { PublishingHouse } from '../publishing-house/entities/publishing-house.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Author, Category, PublishingHouse]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
