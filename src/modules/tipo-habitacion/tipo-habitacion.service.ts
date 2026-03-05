import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { CreateTipoHabitacionDto } from './dto/create-tipo-habitacion.dto';
import { UpdateTipoHabitacionDto } from './dto/update-tipo-habitacion.dto';

@Injectable()
export class TipoHabitacionService {
  constructor(
    @InjectRepository(TipoHabitacion)
    private tipoHabitacionRepository: Repository<TipoHabitacion>,
  ) {}

  async create(createTipoHabitacionDto: CreateTipoHabitacionDto): Promise<TipoHabitacion> {
    const tipoHabitacion = this.tipoHabitacionRepository.create(createTipoHabitacionDto);
    return await this.tipoHabitacionRepository.save(tipoHabitacion);
  }

  async findAll(): Promise<TipoHabitacion[]> {
    return await this.tipoHabitacionRepository.find({
      where: { activo: true },
      relations: ['habitaciones'],
    });
  }

  async findOne(id: number): Promise<TipoHabitacion> {
    const tipoHabitacion = await this.tipoHabitacionRepository.findOne({
      where: { id },
      relations: ['habitaciones'],
    });
    if (!tipoHabitacion) {
      throw new NotFoundException(`Tipo de habitación con ID ${id} no encontrado`);
    }
    return tipoHabitacion;
  }

  async update(id: number, updateTipoHabitacionDto: UpdateTipoHabitacionDto): Promise<TipoHabitacion> {
    const tipoHabitacion = await this.findOne(id);
    Object.assign(tipoHabitacion, updateTipoHabitacionDto);
    return await this.tipoHabitacionRepository.save(tipoHabitacion);
  }

  async remove(id: number): Promise<void> {
    const tipoHabitacion = await this.findOne(id);
    tipoHabitacion.activo = false;
    await this.tipoHabitacionRepository.save(tipoHabitacion);
  }
}