import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import {hash} from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import {compare} from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {config} from 'dotenv';
config();

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async signup(body:UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(body.email);
    if(userExists){
      throw new BadRequestException('User with this email already exists');
    }
    body.password = await hash(body.password, 10);
    const user = this.userRepository.create(body);
    await this.userRepository.save(user);
    return user;
  }

  async signin(body:UserSignInDto): Promise<{accessToken:string, user:UserEntity}> {
    const user = await this.userRepository.createQueryBuilder('users').addSelect('users.password').where('users.email = :email', {email: body.email}).getOne();
    if(!user){
      throw new BadRequestException('Invalid email');
    }
    const isMatch = await compare(body.password, user.password);
    if(!isMatch){
      throw new BadRequestException('Invalid password');
    }
    const token = await this.accessToken(user);
    user.password = undefined!;
    return {
      accessToken: token,
      user: user
    };
  }

  async accessToken(user:UserEntity):Promise<string> {
    const {id, email} = user;
    const expiresIn = '24h';
    const jwtSecret = process.env.JWT_SECRET!;
    return sign({id, email}, jwtSecret, {expiresIn: expiresIn});
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll():Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
