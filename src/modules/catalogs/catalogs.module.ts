import { Module } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../author/entities/author.entity';
import { Category } from '../category/entities/category.entity';
import { PublishingHouse } from '../publishing-house/entities/publishing-house.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Category, PublishingHouse])],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
