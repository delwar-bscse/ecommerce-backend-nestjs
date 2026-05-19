import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RoleGuard } from 'src/utility/guards/role.guard';
import { RolesEnum } from 'src/utility/common/user-roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(RoleGuard(RolesEnum.ADMIN))
  @Post()
  create(@Body() body: CreateProductDto, @CurrentUser() user: UserEntity) {
    return this.productsService.create(body, user);
  }

  @Get()
  async findAll(): Promise<ProductEntity[]> {
    return await this.productsService.findAll();
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
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
