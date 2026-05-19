import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthGuard } from 'src/utility/guards/auth.guard';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { RolesEnum } from 'src/utility/common/user-roles.enum';
import { RoleGuard } from 'src/utility/guards/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body:UserSignUpDto): Promise<UserEntity>{
    return await this.usersService.signup(body);
  }
   @Post('signin')
  async signin(@Body() body:UserSignInDto): Promise<any>{
    return await this.usersService.signin(body);
  }


  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  // @Roles(RolesEnum.USER, RolesEnum.ADMIN)
  // @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(RolesEnum.USER, RolesEnum.ADMIN))
  @Get('profile')
  async getProfile(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
