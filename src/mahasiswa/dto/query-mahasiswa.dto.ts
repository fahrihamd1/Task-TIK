import { Type } from "class-transformer";
import { IsOptional, IsString, Max, Min, IsIn, IsInt } from "class-validator";

export class QueryMahasiswaDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsIn([ 'nim', 'nama', 'email', 'jurusan', 'tgl_lhr'])
    column?: string;

    @IsOptional()
    @IsString()
    search?: string;
}