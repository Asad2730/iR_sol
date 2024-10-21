import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Create user example',
        value: {
          email: 'johndoe@example.com',
          name: 'John Doe',
          password: 'strongpassword',
          role: 'Admin',
        },
      },
    },
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of users' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Limit for pagination' })
  async getUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.userService.getUsers(+page, +limit);
  }

  

  @Get('/email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiQuery({ name: 'email', description: 'Email ID of the user', required: true })
  async getUserByEmail(@Query('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async getUserById(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

}
