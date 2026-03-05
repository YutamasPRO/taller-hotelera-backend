import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';

export class RegistrarConsumoDto {
  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsDateString()
  @IsOptional()
  fecha?: Date;
}