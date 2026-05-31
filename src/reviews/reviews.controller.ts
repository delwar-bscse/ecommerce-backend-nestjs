import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { RolesEnum } from 'src/utility/enums/user-roles.enum';
import { RoleGuard } from 'src/utility/guards/role.guard';
import { ReviewEntity } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(RoleGuard(RolesEnum.ADMIN, RolesEnum.USER))
  @Post()
  async create(@Body() body: CreateReviewDto, @CurrentUser() user: UserEntity): Promise<ReviewEntity> {
    return await this.reviewsService.create(body, user);
  }

  @Get()
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAll();
  }

  @Get("by-product")
  async findAllByProduct(@Body('productId') productId: number): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(productId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReviewEntity | null> {
    return await this.reviewsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
