import { MahasiswaResponseDto } from "./mahasiswa-response.dto";
export class MahasiswaListMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export class MahasiswaListResponseDto {
    data: MahasiswaResponseDto[];
    meta: MahasiswaListMetaDto;
}