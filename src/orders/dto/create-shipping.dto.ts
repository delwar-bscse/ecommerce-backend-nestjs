import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateShippingDto{
  @IsNotEmpty()
  @IsString()
  phone!:string;


  @IsOptional()
  @IsString()
  name!:string;


  @IsNotEmpty()
  @IsString()
  address!:string;


  @IsNotEmpty()
  @IsString()
  city!:string;


  @IsNotEmpty()
  @IsString()
  postCode!:string;


  @IsNotEmpty()
  @IsString()
  state!:string;


  @IsNotEmpty()
  @IsString()
  country!:string
}