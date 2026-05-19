import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>) {}

  async create(body: CreateCategoryDto, user: UserEntity): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(body);
    category.addedBy = user;
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[] | null> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<CategoryEntity | null> {
    const category = await this.categoryRepository.findOne({
      where: {id},
      relations: {addedBy: true},
      select:{
        id: true,
        title: true,
        description: true,
        addedBy: {
          id: true,
          name: true,
          email: true
        }
      }
    });
    if(!category){
      throw new NotFoundException('Category not found');
    }
    return category
  }

  async update(id: number, body: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if(!category){
      throw new NotFoundException('Category not found');
    }
    Object.assign(category,body)
    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
