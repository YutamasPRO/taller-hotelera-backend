import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateHabitacionDto {
  @IsString()
  numero_habitacion: string;

  @IsNumber()
  @Min(1)
  piso: number;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;

  @IsNumber()
  tipo_habitacion_id: number;
}