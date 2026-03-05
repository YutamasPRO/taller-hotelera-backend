import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateTipoHabitacionDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  precio_base: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}