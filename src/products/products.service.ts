import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>, private readonly categoryService: CategoriesService) {}

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

  async findAll():Promise<ProductEntity[]> {
    return this.productRepository.find()
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

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
