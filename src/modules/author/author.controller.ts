import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthorService } from './author.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { DetailAuthorDto } from './dto/detail-author.dto';
import { PageListAuthorDto } from './dto/page-list-author.dto';
import { DeleteAuthorDto } from './dto/delete-author.dto';

@ApiTags('Author')
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('create')
  create(@Body() request: CreateAuthorDto) {
    return this.authorService.create(request);
  }

  @Post('update')
  update(@Body() request: UpdateAuthorDto) {
    return this.authorService.update(request);
  }

  @Get('detail/:_id')
  detail(@Param() params: DetailAuthorDto) {
    return this.authorService.detail(params);
  }

  @Post('get-page-list')
  getPageList(@Body() request: PageListAuthorDto) {
    return this.authorService.getPageList(request);
  }

  @Delete('delete/:_id')
  delete(@Param() params: DeleteAuthorDto) {
    return this.authorService.delete(params);
  }
}
