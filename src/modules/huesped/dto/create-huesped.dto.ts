import { IsString, IsEmail, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateHuespedDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  documento_identidad: string;

  @IsEmail()
  email: string;

  @IsString()
  telefono: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsDateString()
  @IsOptional()
  fecha_nacimiento?: Date;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}