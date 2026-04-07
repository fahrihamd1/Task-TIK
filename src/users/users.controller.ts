import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Get,
    Param,
    Put,
    Delete,
} 

from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<UserResponseDto | null> {
        return this.usersService.findById(id);
    }

    @Get('email/:email')
    async findByEmail(@Param('email') email: string): Promise<UserResponseDto | null> {
        return this.usersService.findByEmail(email);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: Partial<CreateUserDto>,
    ): Promise<UserResponseDto | null> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        return this.usersService.delete(id);
    }
}