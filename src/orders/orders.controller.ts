import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { RolesEnum } from 'src/utility/common/user-roles.enum';
import { RoleGuard } from 'src/utility/guards/role.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(RoleGuard(RolesEnum.ADMIN, RolesEnum.USER))
  @Post()
  async create(@Body() body: CreateOrderDto, @CurrentUser() user: UserEntity) {
    return this.ordersService.create(body, user);
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(+id);
  }

  @UseGuards(RoleGuard(RolesEnum.ADMIN))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateOrderStatusDto, @CurrentUser() user: UserEntity) {
    return await this.ordersService.update(+id, body, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
