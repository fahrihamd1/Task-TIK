import { Injectable } from '@nestjs/common';
import { KnexService } from '../database/knex.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { MahasiswaResponseDto } from './dto/mahasiswa-response.dto';
import { MahasiswaListResponseDto } from './dto/mahasiswa-list-response.dto';
import { QueryMahasiswaDto } from './dto/query-mahasiswa.dto';

@Injectable()
export class MahasiswaService {
  constructor(private readonly knexService: KnexService) {}
  
  private mapToResponseDto(mahasiswa: any): MahasiswaResponseDto {
    return {
      id: mahasiswa.id,
      nim: mahasiswa.nim,
      nama: mahasiswa.nama,
      email: mahasiswa.email,
      jurusan: mahasiswa.jurusan,
      tgl_lhr: mahasiswa.tgl_lhr,
      created_at: mahasiswa.created_at,
      updated_at: mahasiswa.updated_at,
    }};

    async create(createMahasiswaDto: CreateMahasiswaDto): Promise<MahasiswaResponseDto> {
        try {
            const { nim, nama, email, jurusan, tgl_lhr, created_at, updated_at, is_active } = createMahasiswaDto;
            const [mahasiswa] = await this.knexService.connection('data_mhs').insert({nim, nama, email, jurusan, tgl_lhr, created_at, updated_at, is_active}).returning('*');
            return this.mapToResponseDto(mahasiswa);
        } catch (error) {
            throw error;
        }
    }

    async findAll(query: QueryMahasiswaDto): Promise<MahasiswaListResponseDto> {
        try {
            const page = query.page || 1;
            const limit = query.limit || 10;
            const offset = (page - 1) * limit;
            const baseQuery = this.knexService.connection('data_mhs').where({ is_active: true });

            if (query.search && query.column) {
                baseQuery.andWhere(query.column, 'ilike', `%${query.search}%`);
            }

            const countResult = await baseQuery.clone().count<{count: string}[]>('* as count');
            const total = Number(countResult[0].count ??0);
            const rows = await baseQuery.clone().select('*').limit(limit).offset(offset);
            return {data: rows.map(this.mapToResponseDto), meta: { page, limit, total, totalPages: Math.ceil(total / limit) }};
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, updateMahasiswaDto: CreateMahasiswaDto): Promise<MahasiswaResponseDto> {
        try {
            const [mahasiswa] = await this.knexService.connection('data_mhs').where({ id }).update(updateMahasiswaDto).returning('*');
            return this.mapToResponseDto(mahasiswa);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.knexService.connection('data_mhs').where({ id }).update({ is_active: false });
        } catch (error) {
            throw error;
        }
    }
}
