import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping.dto";
import { ValidateNested } from "class-validator";
import { OrderProductsDto } from "./create-order-porducts.dto";

export class CreateOrderDto {
  @Type(()=>CreateShippingDto)
  @ValidateNested()
  shippingAddress!:CreateShippingDto

  @Type(()=>OrderProductsDto)
  @ValidateNested()
  orderProducts!:OrderProductsDto[]
}
