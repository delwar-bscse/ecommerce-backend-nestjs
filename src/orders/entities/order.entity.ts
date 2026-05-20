import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { OrderStatusEnum } from "../enums/order-status.enum";
import { UserEntity } from "src/users/entities/user.entity";
import { ShippingEntity } from "./shipping.entity";
import { OrderProductsEntity } from "./order-products.entity";

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Timestamp;

  @Column({type:'enum', enum: OrderStatusEnum, default: OrderStatusEnum.PROCESSING})
  status!: string;

  @Column({nullable: true})
  shippedAt!: Date;

  @Column({nullable: true})
  deliveredAt!: Date 

  @Column({nullable: true})
  cancelledAt!: Date

  @ManyToOne(()=>UserEntity, user=>user.ordersUpdatedBy)
  updatedBy!: UserEntity

  @OneToOne(()=>ShippingEntity, shipping=>shipping.order, {cascade:true})
  @JoinColumn()
  shippingAddress!:ShippingEntity

  @OneToMany(()=>OrderProductsEntity, products=>products.order)
  products!:OrderProductsEntity[];

  @ManyToOne(()=>UserEntity, user=>user.orders)
  user!:UserEntity
}
