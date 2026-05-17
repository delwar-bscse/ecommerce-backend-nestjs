import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserSignUpDto {
  @IsNotEmpty({message: 'Name is required'})
  @IsString({message: 'Name must be a string'})
  name!: string;

  @IsNotEmpty({message: 'Email is required'})
  @IsEmail({}, {message: 'Invalid email format'})
  email!: string;

  @IsNotEmpty({message: 'Password is required'})
  @MinLength(3, {message: 'Password must be at least 3 characters long'})
  password!: string;
}