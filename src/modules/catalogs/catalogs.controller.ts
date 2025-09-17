import { Controller, Get } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Catalogs (Danh sách)')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get('authors')
  @ApiOperation({ summary: 'Danh sách tác giả' })
  getCatalogAuthor() {
    return this.catalogsService.getCatalogAuthor();
  }

  @Get('categorys')
  @ApiOperation({ summary: 'Danh sách thể loại' })
  getCatalogCategory() {
    return this.catalogsService.getCatalogCategory();
  }

  @Get('publishingHouses')
  @ApiOperation({ summary: 'Danh sách nhà xuất bản' })
  getCatalogPublishingHouse() {
    return this.catalogsService.getCatalogPublishingHouse();
  }
}
