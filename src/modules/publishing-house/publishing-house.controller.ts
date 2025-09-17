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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DetailPublishingHouseDto } from './dto/detail-publishing-house.dto';
import { PageListPublishingHouseDto } from './dto/page-list-publishing-house.dto';
import { DeletePublishingHouseDto } from './dto/delete-publishing-house.dto';
import { ListBookByPublishingouseDto } from './dto/list-book-by-publishing-house.dto';

@ApiTags('PublishingHouse (Nhà xuất bản)')
@Controller('publishing-house')
export class PublishingHouseController {
  constructor(
    private readonly publishingHouseService: PublishingHouseService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo mới nhà xuất bản' })
  create(@Body() request: CreatePublishingHouseDto) {
    return this.publishingHouseService.create(request);
  }

  @Post('update')
  @ApiOperation({ summary: 'Chỉnh sửa nhà xuất bản' })
  update(@Body() request: UpdatePublishingHouseDto) {
    return this.publishingHouseService.update(request);
  }

  @Get('detail/:_id')
  @ApiOperation({ summary: 'Chi tiết nhà xuất bản' })
  detail(@Param() params: DetailPublishingHouseDto) {
    return this.publishingHouseService.detail(params);
  }

  @Post('get-page-list')
  @ApiOperation({ summary: 'Danh sách nhà xuất bản' })
  getPageList(@Body() request: PageListPublishingHouseDto) {
    return this.publishingHouseService.getPageList(request);
  }

  @Delete('delete/:_id')
  @ApiOperation({ summary: 'Xóa nhà xuất bản' })
  delete(@Param() params: DeletePublishingHouseDto) {
    return this.publishingHouseService.delete(params);
  }

  @Post('list-book-by-publishing-house')
  @ApiOperation({ summary: 'Danh sách sách thuộc nhà xuất bản' })
  listBookByPublishingHouse(@Body() request: ListBookByPublishingouseDto) {
    return this.publishingHouseService.listBookByPublishingHouse(request);
  }
}
