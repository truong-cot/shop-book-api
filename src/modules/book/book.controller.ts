import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DeleteBookDto } from './dto/delete-book.dto';
import { DetailBookDto } from './dto/detail-book.dto';
import { PageListBookDto } from './dto/page-list-book.dto';

@ApiTags('Book (Sách)')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo mới sách' })
  create(@Body() request: CreateBookDto) {
    return this.bookService.create(request);
  }

  @Post('update')
  @ApiOperation({ summary: 'Chỉnh sửa sách' })
  update(@Body() request: UpdateBookDto) {
    return this.bookService.update(request);
  }

  @Get('detail/:_id')
  @ApiOperation({ summary: 'Chi tiết sách' })
  detail(@Param() params: DetailBookDto) {
    return this.bookService.detail(params);
  }

  @Delete('delete/:_id')
  @ApiOperation({ summary: 'Xóa sách' })
  delete(@Param() params: DeleteBookDto) {
    return this.bookService.delete(params);
  }

  @Post('get-page-list')
  @ApiOperation({ summary: 'Danh sách sách' })
  getPageList(@Body() request: PageListBookDto) {
    return this.bookService.getPageList(request);
  }
}
