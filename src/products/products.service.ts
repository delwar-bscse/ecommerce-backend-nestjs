import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { OrderStatusEnum } from 'src/orders/enums/order-status.enum';
import dataSource from 'db/data-source';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>, private readonly categoryService: CategoriesService, private readonly ordersService: OrdersService) {}

  async create(body: CreateProductDto, user: UserEntity): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(+body.categoryId);
    if(!category){
      throw new NotFoundException('Category not found');
    }
    const product = await this.productRepository.create(body);
    product.category = category;
    product.addedBy = user;
    await this.productRepository.save(product);
    return product;
  }
 
  async findAll(query:any):Promise<any> {
    let filteredTotalProducts:number = 0;
    let limit:number = query.limit || 10;

    const queryBuilder = dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoin('products.reviews', 'review')
      .addSelect([
        'COUNT(review.id) AS reviewCount',
        'AVG(review.ratings)::numeric(10,2) AS avgRating'
      ])
      .groupBy('products.id, category.id')

    // const totalProducts = await queryBuilder.getCount();
    if(query.search){
      queryBuilder.andWhere('products.title ILIKE :title', {title: `%${query.search}%`});
    }

    if(query.category){
      queryBuilder.andWhere('category.id = :category', {category: query.category});
    }

    if(query.minPrice){
      queryBuilder.andWhere('products.price >= :minPrice', {minPrice: query.minPrice});
    }

    if(query.maxPrice){
      queryBuilder.andWhere('products.price <= :maxPrice', {maxPrice: query.maxPrice});
    }

    if(query.minRating){
      queryBuilder.andHaving('AVG(review.ratings) >= :minRating', {minRating: query.minRating});
    }
    if(query.maxRating){
      queryBuilder.andHaving('AVG(review.ratings)<= :maxRating', {maxRating: query.maxRating});
    }
    queryBuilder.limit(limit);
    if(query.offset){
      queryBuilder.offset(query.offset);
    }

    const products = await queryBuilder.getRawMany();
    return {products, totalProducts: filteredTotalProducts, limit};
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {id},
      relations:{
        category: true,
        addedBy:true
      },
      select:{
        category:{
          id:true,
          title:true,
          description:true
        },
        addedBy:{
          id:true,
          name:true,
          email:true
        }
      }
    });
    if(!product){
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, body: UpdateProductDto, user: UserEntity):Promise<ProductEntity> {
    const product = await this.findOne(id);
    Object.assign(product,body);
    product.addedBy = user
    if(body.categoryId){
      const category = await this.categoryService.findOne(+body.categoryId);
      if(!category){
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    const order = await this.ordersService.findOneByProductId(id);
    if(order){
      throw new BadRequestException('Product is in an order');
    }
    return await this.productRepository.remove(product);
  }

  async updateStock(id:number, stock:number, status:string){
    const product = await this.findOne(id);
    if(status === OrderStatusEnum.DELIVERED){
      product.stock -= stock;
    }else{
      product.stock += stock;
    }
    return await this.productRepository.save(product);
  }
}
