import { IsNotEmpty, IsNumber, IsString } from "class-validator";

  
  export class CreateReviewDto {
    @IsNotEmpty({message: 'ProductId is required'})
    @IsNumber({},{message: 'ProductId must be a number'})
    productId!: number;

    @IsNotEmpty({message: 'Ratings is required'})
    @IsNumber({},{message: 'Ratings must be a number'})
    ratings!: number;

    @IsNotEmpty({message: 'Comment is required'})
    @IsString({message: 'Comment must be a string'})
    comment!: string;
  }
