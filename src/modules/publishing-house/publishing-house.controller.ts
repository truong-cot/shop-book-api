import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PublishingHouseService } from './publishing-house.service';
import { CreatePublishingHouseDto } from './dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from './dto/update-publishing-house.dto';
import { ApiTags } from '@nestjs/swagger';
import { DetailPublishingHouseDto } from './dto/detail-publishing-house.dto';
import { PageListPublishingHouseDto } from './dto/page-list-publishing-house.dto';
import { DeletePublishingHouseDto } from './dto/delete-publishing-house.dto';

@ApiTags('PublishingHouse (Nhà xuất bản)')
@Controller('publishing-house')
export class PublishingHouseController {
  constructor(
    private readonly publishingHouseService: PublishingHouseService,
  ) {}

  @Post('create')
  create(@Body() request: CreatePublishingHouseDto) {
    return this.publishingHouseService.create(request);
  }

  @Post('update')
  update(@Body() request: UpdatePublishingHouseDto) {
    return this.publishingHouseService.update(request);
  }

  @Get('detail/:_id')
  detail(@Param() params: DetailPublishingHouseDto) {
    return this.publishingHouseService.detail(params);
  }

  @Post('get-page-list')
  getPageList(@Body() request: PageListPublishingHouseDto) {
    return this.publishingHouseService.getPageList(request);
  }

  @Delete('delete/:_id')
  delete(@Param() params: DeletePublishingHouseDto) {
    return this.publishingHouseService.delete(params);
  }
}
