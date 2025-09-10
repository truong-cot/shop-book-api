import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DetailCategoryDto } from './dto/detail-category.dto';
import { PageListCategoryDto } from './dto/page-list-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  create(@Body() request: CreateCategoryDto) {
    return this.categoryService.create(request);
  }

  @Post('update')
  update(@Body() request: UpdateCategoryDto) {
    return this.categoryService.update(request);
  }

  @Get('detail/:_id')
  detail(@Param() params: DetailCategoryDto) {
    return this.categoryService.detail(params);
  }

  @Post('get-page-list')
  getPageList(@Body() request: PageListCategoryDto) {
    return this.categoryService.getPageList(request);
  }

  @Delete('delete/:_id')
  delete(@Param() params: DeleteCategoryDto) {
    return this.categoryService.delete(params);
  }
}
