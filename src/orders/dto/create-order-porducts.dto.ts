import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderProductsDto {
  @IsNotEmpty()
  id!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  product_unit_price!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  product_quantity!: number
}