import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DetailCategoryDto } from './dto/detail-category.dto';
import { PageListCategoryDto } from './dto/page-list-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';

@ApiTags('Category (Thể loại)')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo mới thể loại' })
  create(@Body() request: CreateCategoryDto) {
    return this.categoryService.create(request);
  }

  @Post('update')
  @ApiOperation({ summary: 'Chỉnh sửa thể loại' })
  update(@Body() request: UpdateCategoryDto) {
    return this.categoryService.update(request);
  }

  @Get('detail/:_id')
  @ApiOperation({ summary: 'Chi tiết thể loại' })
  detail(@Param() params: DetailCategoryDto) {
    return this.categoryService.detail(params);
  }

  @Post('get-page-list')
  @ApiOperation({ summary: 'Danh sách thể loại' })
  getPageList(@Body() request: PageListCategoryDto) {
    return this.categoryService.getPageList(request);
  }

  @Delete('delete/:_id')
  @ApiOperation({ summary: 'Xóa thể loại' })
  delete(@Param() params: DeleteCategoryDto) {
    return this.categoryService.delete(params);
  }
}
