import { IsNumber, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateEstadiaDto {
  @IsDateString()
  fecha_checkin: Date;

  @IsDateString()
  @IsOptional()
  fecha_checkout?: Date;

  @IsNumber()
  @Min(1)
  numero_noches: number;

  @IsNumber()
  huesped_id: number;

  @IsNumber()
  habitacion_id: number;
}