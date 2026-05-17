import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import {hash} from 'bcrypt';

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

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
