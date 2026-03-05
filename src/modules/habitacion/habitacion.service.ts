import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habitacion } from './entities/habitacion.entity';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';
import { TipoHabitacionService } from '../tipo-habitacion/tipo-habitacion.service';

@Injectable()
export class HabitacionService {
  constructor(
    @InjectRepository(Habitacion)
    private habitacionRepository: Repository<Habitacion>,
    private tipoHabitacionService: TipoHabitacionService,
  ) {}

  async create(createHabitacionDto: CreateHabitacionDto): Promise<Habitacion> {
    // Verificar que el tipo de habitación existe
    await this.tipoHabitacionService.findOne(createHabitacionDto.tipo_habitacion_id);

    const habitacion = this.habitacionRepository.create(createHabitacionDto);
    return await this.habitacionRepository.save(habitacion);
  }

  async findAll(): Promise<Habitacion[]> {
    return await this.habitacionRepository.find({
      relations: ['tipo_habitacion'],
    });
  }

  async findOne(id: number): Promise<Habitacion> {
    const habitacion = await this.habitacionRepository.findOne({
      where: { id },
      relations: ['tipo_habitacion', 'estadias'],
    });
    if (!habitacion) {
      throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
    }
    return habitacion;
  }

  async findByNumero(numero_habitacion: string): Promise<Habitacion> {
    const habitacion = await this.habitacionRepository.findOne({
      where: { numero_habitacion },
      relations: ['tipo_habitacion'],
    });
    if (!habitacion) {
      throw new NotFoundException(`Habitación ${numero_habitacion} no encontrada`);
    }
    return habitacion;
  }

  async findDisponibles(): Promise<Habitacion[]> {
    return await this.habitacionRepository.find({
      where: { disponible: true },
      relations: ['tipo_habitacion'],
    });
  }

  async update(id: number, updateHabitacionDto: UpdateHabitacionDto): Promise<Habitacion> {
    const habitacion = await this.findOne(id);
    
    if (updateHabitacionDto.tipo_habitacion_id) {
      await this.tipoHabitacionService.findOne(updateHabitacionDto.tipo_habitacion_id);
    }
    
    Object.assign(habitacion, updateHabitacionDto);
    return await this.habitacionRepository.save(habitacion);
  }

  async updateDisponibilidad(id: number, disponible: boolean): Promise<Habitacion> {
    const habitacion = await this.findOne(id);
    habitacion.disponible = disponible;
    return await this.habitacionRepository.save(habitacion);
  }

  async remove(id: number): Promise<void> {
    const habitacion = await this.findOne(id);
    await this.habitacionRepository.remove(habitacion);
  }
}