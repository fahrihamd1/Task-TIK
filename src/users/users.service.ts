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
async findAll(): Promise<UserResponseDto[]> {
    const users = await this.knexService.connection('users').select('*');
    return users.map(user => this.mapToResponseDto(user));
}

async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.knexService.connection('users').where({ id }).first();
    return user ? this.mapToResponseDto(user) : null;
}

async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.knexService.connection('users').where({ email }).first();
    return user ? this.mapToResponseDto(user) : null;
}

async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<UserResponseDto | null> {
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const [updatedUser] = await this.knexService.connection('users').where({ id }).update(updateData).returning('*');
    return updatedUser ? this.mapToResponseDto(updatedUser) : null;
}

async delete(id: number): Promise<void> {
    await this.knexService.connection('users').where({ id }).update({ is_active: false }).returning('*');
    }
}
