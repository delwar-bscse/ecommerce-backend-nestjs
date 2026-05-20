import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RoleGuard } from 'src/utility/guards/role.guard';
import { RolesEnum } from 'src/utility/common/user-roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { SerializeIncludes } from 'src/utility/interceptors/serialize.interceptor';
import { ProductsDto } from './dto/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(RoleGuard(RolesEnum.ADMIN))
  @Post()
  create(@Body() body: CreateProductDto, @CurrentUser() user: UserEntity) {
    return this.productsService.create(body, user);
  }

  @SerializeIncludes(ProductsDto)
  @Get()
  async findAll(@Query() query: any): Promise<ProductsDto> {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity | null> {
    return await this.productsService.findOne(+id);
  }

  @UseGuards(RoleGuard(RolesEnum.ADMIN))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto, @CurrentUser() user: UserEntity) {
    return await this.productsService.update(+id, body, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }
}
