import { Controller, Body, Get, Post, Put, Delete, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { MahasiswaResponseDto } from './dto/mahasiswa-response.dto';
import { QueryMahasiswaDto } from './dto/query-mahasiswa.dto';

@Controller('mahasiswa')
export class MahasiswaController {
    constructor(private readonly mahasiswaService: MahasiswaService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createMahasiswaDto: CreateMahasiswaDto): Promise<MahasiswaResponseDto> {
        return this.mahasiswaService.create(createMahasiswaDto);
    }

    @Get()
    async findAll(@Query() query: QueryMahasiswaDto): Promise<any> {
        return this.mahasiswaService.findAll(query);
    }

    @Put(':id')
    async update(@Body() updateMahasiswaDto: CreateMahasiswaDto, @Param('id') id: number): Promise<MahasiswaResponseDto> {
        return this.mahasiswaService.Update(id, updateMahasiswaDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        return this.mahasiswaService.delete(id);
    }
}
