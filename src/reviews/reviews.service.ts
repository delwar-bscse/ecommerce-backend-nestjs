import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>, private readonly productsService: ProductsService) { }

  async create(body: CreateReviewDto, user: UserEntity): Promise<ReviewEntity> {
    const product = await this.productsService.findOne(body.productId);
    let review = await this.findOneByUserAndProduct(user.id, body.productId);
    if (!review) {
      review = this.reviewRepository.create(body);
      review.user = user;
      review.product = product;
    } else {
      review.comment = body.comment;
      review.ratings = body.ratings;
    }
    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find();
  }

  async findAllByProduct(id: number): Promise<ReviewEntity[]> {
    const product = await this.productsService.findOne(id);
    return await this.reviewRepository.find({
      where: {
        product: { id }
      },
      relations: {
        user: true,
        product: {
          category: true
        }
      }
    });
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true
        }
      }
    })
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review
  }


  async remove(id: number) {
    const review = await this.findOne(id);
    return await this.reviewRepository.remove(review);
  }

  async findOneByUserAndProduct(userId: number, productId: number): Promise<ReviewEntity | null> {
    return await this.reviewRepository.findOne({
      where: {
        user: {
          id: userId
        },
        product: {
          id: productId
        }
      },
      relations: {
        user: true,
        product: {
          category: true
        }
      }
    });
  }
}
