import { Module } from '@nestjs/common';
import { PublishingHouseService } from './publishing-house.service';
import { PublishingHouseController } from './publishing-house.controller';
import { PublishingHouse } from './entities/publishing-house.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../book/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublishingHouse, Book])],
  controllers: [PublishingHouseController],
  providers: [PublishingHouseService],
})
export class PublishingHouseModule {}
