import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Get all users' })
    @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Limit of users', example: 10 })
    @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page of users', example: 1 })
    getUsers(@Query('limit', new DefaultValuePipe(10), ParseIntPipe,) limit: number = 10,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1) {
        return this.usersService.getAllUsers(limit, page);
    }

    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUserById(id);
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto): string {
        console.log(createUserDto instanceof CreateUserDto);
        return `User created: ${createUserDto.name} ${createUserDto.email} ${createUserDto.password}`;
    }

    @Put(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): string {
        console.log(updateUserDto);
        return `User ${id} updated`;
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string): string {
        return `User ${id} deleted`;
    }
}
