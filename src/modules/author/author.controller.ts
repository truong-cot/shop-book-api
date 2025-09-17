import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthorService } from './author.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { DetailAuthorDto } from './dto/detail-author.dto';
import { PageListAuthorDto } from './dto/page-list-author.dto';
import { DeleteAuthorDto } from './dto/delete-author.dto';
import { ListBookByAuthorDto } from './dto/list-book-by-author.dto';

@ApiTags('Author (Tác giả)')
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo mới tác giả' })
  create(@Body() request: CreateAuthorDto) {
    return this.authorService.create(request);
  }

  @Post('update')
  @ApiOperation({ summary: 'Chỉnh sửa tác giả' })
  update(@Body() request: UpdateAuthorDto) {
    return this.authorService.update(request);
  }

  @Get('detail/:_id')
  @ApiOperation({ summary: 'Chi tiết tác giả' })
  detail(@Param() params: DetailAuthorDto) {
    return this.authorService.detail(params);
  }

  @Post('get-page-list')
  @ApiOperation({ summary: 'Danh sách tác giả' })
  getPageList(@Body() request: PageListAuthorDto) {
    return this.authorService.getPageList(request);
  }

  @Delete('delete/:_id')
  @ApiOperation({ summary: 'Xóa tác giả' })
  delete(@Param() params: DeleteAuthorDto) {
    return this.authorService.delete(params);
  }

  @Post('list-book-by-author')
  @ApiOperation({ summary: 'Danh sách sách thuộc tác giả' })
  listBookByAuthor(@Body() request: ListBookByAuthorDto) {
    return this.authorService.listBookByAuthor(request);
  }
}
