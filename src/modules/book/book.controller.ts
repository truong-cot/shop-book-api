import { Body, Controller, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

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
  @ApiOperation({ summary: 'Chỉnh sửa mới sách' })
  update(@Body() request: UpdateBookDto) {
    return this.bookService.update(request);
  }
}
