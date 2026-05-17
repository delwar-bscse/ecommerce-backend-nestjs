import { RolesEnum } from "src/utility/common/user-roles.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

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
}
