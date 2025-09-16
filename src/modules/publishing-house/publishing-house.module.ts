import { Module } from '@nestjs/common';
import { PublishingHouseService } from './publishing-house.service';
import { PublishingHouseController } from './publishing-house.controller';
import { PublishingHouse } from './entities/publishing-house.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PublishingHouse])],
  controllers: [PublishingHouseController],
  providers: [PublishingHouseService],
})
export class PublishingHouseModule {}
