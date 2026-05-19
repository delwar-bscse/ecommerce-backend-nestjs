import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderProductsEntity } from './entities/order-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>, @InjectRepository(OrderProductsEntity) private orderProductsRepository: Repository<OrderProductsEntity>, private readonly productsService: ProductsService) { }

  async create(body: CreateOrderDto, user: UserEntity) {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, body.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = user;

    const order = await this.orderRepository.save(orderEntity);

    let opEntity: {
      order: OrderEntity,
      product: ProductEntity,
      product_unit_price: number,
      product_quantity: number
    }[] = [];

    for (const item of body.orderProducts) {
      opEntity.push({
        order: order,
        product: await this.productsService.findOne(item.id),
        product_unit_price: item.product_unit_price,
        product_quantity: item.product_quantity
      });
    }
    const op = await this.orderProductsRepository.createQueryBuilder()
      .insert()
      .into(OrderProductsEntity)
      .values(opEntity)
      .execute();

    return await this.findOne(order.id);
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where:{id},
      relations:{
        shippingAddress: true,
        user: true,
        products: {
          product: true
        }
      }
    })
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
