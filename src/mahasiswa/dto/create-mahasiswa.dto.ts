import { IsString, IsEmail, IsBoolean, IsNotEmpty } from "class-validator";

export enum Jurusan {
    Informatika = 'Informatika',
    Sistem_Informasi = 'Sistem Informasi',
    Teknik_Elektro = 'Teknik Elektro',
    Manajemen = 'Manajemen',
}

export class CreateMahasiswaDto {
    @IsString()
    @IsNotEmpty()
    nim: string;

    @IsString()
    @IsNotEmpty()
    nama: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    jurusan: string;

    @IsNotEmpty()
    @IsString()
    tgl_lhr: string;

    @IsNotEmpty()
    @IsString()
    created_at: string;

    @IsNotEmpty()
    @IsString()
    updated_at: string;

    @IsBoolean()
    is_active: boolean;
}