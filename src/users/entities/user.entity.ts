import { CategoryEntity } from "src/categories/entities/category.entity";
import { OrderEntity } from "src/orders/entities/order.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { RolesEnum } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!:string;

  @Column()
  email!:string;

  @Column({select:false})
  password!:string;

  @Column({type:'enum', enum:RolesEnum, array:true, default:[RolesEnum.USER]})
  roles!:RolesEnum

  @CreateDateColumn()
  createdAt!: Timestamp;
  
  @CreateDateColumn()
  updatedAt!: Timestamp;

  @OneToMany(()=>CategoryEntity, category=>category.addedBy)
  categories!:CategoryEntity[]

  @OneToMany(()=>ProductEntity, product=>product.addedBy)
  products!:ProductEntity[]

  @OneToMany(()=>ReviewEntity, review=>review.user)
  reviews!:ReviewEntity[]

  @OneToMany(()=>OrderEntity, order=>order.updatedBy)
  ordersUpdatedBy!:OrderEntity[]

  @OneToMany(()=>OrderEntity, order=>order.user)
  orders!:OrderEntity[]
}
