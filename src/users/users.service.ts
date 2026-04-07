import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto'; // diambil dari create-user.dto.ts
import { KnexService } from '../database/knex.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto'; // diambil dari user-response.dto.ts

@Injectable()
export class UsersService {
constructor(private readonly knexService: KnexService) {}

async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
const { email, name, password, is_active, register_date } = createUserDto;

// Hash password
const hashedPassword = await bcrypt.hash(password as string, 10);

const [user] = await this.knexService.connection('users').insert({
    email,
    name,
    password: hashedPassword,
    is_active: is_active ?? true,
    register_date: register_date ?? new Date(),
}).returning('*');

// Remove password from response
return this.mapToResponseDto(user);}
private mapToResponseDto(user: any): UserResponseDto {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        is_active: user.is_active,
        register_date: user.register_date,
    };
}
}