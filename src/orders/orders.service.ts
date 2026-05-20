import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderProductsEntity } from './entities/order-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatusEnum } from './enums/order-status.enum';

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

  async findAll() {

    return await this.orderRepository.find({
      relations:{
        shippingAddress: true,
        user: true,
        products: {
          product: true
        }
      }
    })
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

  async update(id: number, body: UpdateOrderStatusDto, user: UserEntity) {
    const order = await this.findOne(id);
    if(!order) throw new NotFoundException('Order not found');

    if(body.status===OrderStatusEnum.SHIPPED && order.status===OrderStatusEnum.PROCESSING){
      order.shippedAt = new Date();
    }else if(body.status===OrderStatusEnum.DELIVERED && order.status===OrderStatusEnum.SHIPPED){
      order.deliveredAt = new Date();
    }else if(body.status===OrderStatusEnum.CANCELLED && order.status!=OrderStatusEnum.DELIVERED && order.status!=OrderStatusEnum.CANCELLED){
      order.cancelledAt = new Date();
    }else{
      throw new BadRequestException(`You don't turn ${order.status} to ${body.status}`);
    }
    order.status = body.status;
    order.updatedBy = user;
    await this.orderRepository.save(order);
    await this.stockUpdate(order, body.status);
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order:OrderEntity, status:string){
    order.products.forEach(async item => {
      await this.productsService.updateStock(item.product.id, item.product_quantity, status);
    })
  }
}
