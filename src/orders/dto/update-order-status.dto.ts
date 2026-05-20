import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrderStatusEnum } from "../enums/order-status.enum";

export class UpdateOrderStatusDto{
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderStatusEnum.SHIPPED, OrderStatusEnum.DELIVERED, OrderStatusEnum.CANCELLED])
  status!:OrderStatusEnum
}