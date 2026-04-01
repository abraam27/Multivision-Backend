import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.schema';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { CreatedUserResponseInterceptor } from './interceptors/created-user-response.interceptor';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Get all users' })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit of users',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page of users',
    example: 1,
  })
  getUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ) {
    return this.usersService.getAllUsers(limit, page);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Auth(AuthType.None)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): string {
    console.log(updateUserDto);
    return `User ${id} updated`;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): string {
    return `User ${id} deleted`;
  }
}
