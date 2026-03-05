import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estadia } from './entities/estadia.entity';
import { CreateEstadiaDto } from './dto/create-estadia.dto';
import { UpdateEstadiaDto } from './dto/update-estadia.dto';
import { RegistrarConsumoDto } from './dto/registrar-consumo.dto';
import { HuespedService } from '../huesped/huesped.service';
import { HabitacionService } from '../habitacion/habitacion.service';
import { ConsumoService } from '../consumo/consumo.service';
import { Consumo } from '../consumo/entities/consumo.entity';

@Injectable()
export class EstadiaService {
  constructor(
    @InjectRepository(Estadia)
    private estadiaRepository: Repository<Estadia>,
    private huespedService: HuespedService,
    private habitacionService: HabitacionService,
    private consumoService: ConsumoService,
  ) {}

  async create(createEstadiaDto: CreateEstadiaDto): Promise<Estadia> {
    // Verificar que el huésped existe
    await this.huespedService.findOne(createEstadiaDto.huesped_id);

    // Verificar que la habitación existe y está disponible
    const habitacion = await this.habitacionService.findOne(createEstadiaDto.habitacion_id);
    
    if (!habitacion.disponible) {
      throw new BadRequestException('La habitación no está disponible');
    }

    // Calcular subtotal de habitación
    const subtotal_habitacion = Number(habitacion.tipo_habitacion.precio_base) * createEstadiaDto.numero_noches;

    // Crear estadía
    const estadia = this.estadiaRepository.create({
      ...createEstadiaDto,
      subtotal_habitacion,
    });

    // Marcar habitación como no disponible
    await this.habitacionService.updateDisponibilidad(habitacion.id, false);

    return await this.estadiaRepository.save(estadia);
  }

  async findAll(): Promise<Estadia[]> {
    return await this.estadiaRepository.find({
      relations: ['huesped', 'habitacion', 'habitacion.tipo_habitacion', 'consumos'],
    });
  }

  async findOne(id: number): Promise<Estadia> {
    const estadia = await this.estadiaRepository.findOne({
      where: { id },
      relations: ['huesped', 'habitacion', 'habitacion.tipo_habitacion', 'consumos'],
    });
    if (!estadia) {
      throw new NotFoundException(`Estadía con ID ${id} no encontrada`);
    }
    return estadia;
  }

  async findActivas(): Promise<Estadia[]> {
    return await this.estadiaRepository.find({
      where: { activa: true },
      relations: ['huesped', 'habitacion', 'habitacion.tipo_habitacion', 'consumos'],
    });
  }

  async findByHuesped(huesped_id: number): Promise<Estadia[]> {
    return await this.estadiaRepository.find({
      where: { huesped_id },
      relations: ['habitacion', 'habitacion.tipo_habitacion', 'consumos'],
      order: { fecha_checkin: 'DESC' },
    });
  }

  async registrarConsumo(estadia_id: number, registrarConsumoDto: RegistrarConsumoDto): Promise<Consumo> {
    const estadia = await this.findOne(estadia_id);
    
    if (!estadia.activa) {
      throw new BadRequestException('No se pueden registrar consumos en una estadía finalizada');
    }

    return await this.consumoService.create({
      ...registrarConsumoDto,
      estadia_id,
    });
  }

  async realizarCheckout(id: number): Promise<Estadia> {
    const estadia = await this.findOne(id);
    
    if (!estadia.activa) {
      throw new BadRequestException('La estadía ya ha sido finalizada');
    }

    // Calcular total de consumos
    const totalConsumos = await this.consumoService.calcularTotalConsumos(id);

    // Actualizar estadía
    estadia.fecha_checkout = new Date();
    estadia.activa = false;

    // Marcar habitación como disponible
    await this.habitacionService.updateDisponibilidad(estadia.habitacion_id, true);

    return await this.estadiaRepository.save(estadia);
  }

  async obtenerCuentaHuesped(huesped_id: number): Promise<any> {
    const estadias = await this.findByHuesped(huesped_id);
    
    if (estadias.length === 0) {
      throw new NotFoundException(`No se encontraron estadías para el huésped con ID ${huesped_id}`);
    }

    // Obtener la estadía activa o la más reciente
    const estadiaActual = estadias.find(e => e.activa) || estadias[0];
    
    // Calcular totales
    const totalConsumos = await this.consumoService.calcularTotalConsumos(estadiaActual.id);
    const totalEstadia = Number(estadiaActual.subtotal_habitacion) + totalConsumos;

    return {
      huesped: {
        id: estadiaActual.huesped.id,
        nombre: `${estadiaActual.huesped.nombre} ${estadiaActual.huesped.apellido}`,
        documento: estadiaActual.huesped.documento_identidad,
      },
      estadia: {
        id: estadiaActual.id,
        fecha_checkin: estadiaActual.fecha_checkin,
        fecha_checkout: estadiaActual.fecha_checkout,
        activa: estadiaActual.activa,
        numero_noches: estadiaActual.numero_noches,
      },
      habitacion: {
        numero: estadiaActual.habitacion.numero_habitacion,
        piso: estadiaActual.habitacion.piso,
        tipo: estadiaActual.habitacion.tipo_habitacion.nombre,
        precio_por_noche: estadiaActual.habitacion.tipo_habitacion.precio_base,
      },
      consumos: estadiaActual.consumos.map(consumo => ({
        id: consumo.id,
        descripcion: consumo.descripcion,
        precio: consumo.precio,
        fecha: consumo.fecha,
      })),
      subtotales: {
        habitacion: estadiaActual.subtotal_habitacion,
        consumos: totalConsumos,
        total: totalEstadia,
      },
    };
  }

  async update(id: number, updateEstadiaDto: UpdateEstadiaDto): Promise<Estadia> {
    const estadia = await this.findOne(id);
    
    // Si se actualiza la habitación, verificar disponibilidad
    if (updateEstadiaDto.habitacion_id && updateEstadiaDto.habitacion_id !== estadia.habitacion_id) {
      const nuevaHabitacion = await this.habitacionService.findOne(updateEstadiaDto.habitacion_id);
      if (!nuevaHabitacion.disponible) {
        throw new BadRequestException('La nueva habitación no está disponible');
      }

      // Liberar habitación anterior y ocupar nueva
      await this.habitacionService.updateDisponibilidad(estadia.habitacion_id, true);
      await this.habitacionService.updateDisponibilidad(nuevaHabitacion.id, false);
    }

    // Recalcular subtotal si cambió el número de noches o la habitación
    if (updateEstadiaDto.numero_noches || updateEstadiaDto.habitacion_id) {
      const habitacion = updateEstadiaDto.habitacion_id 
        ? await this.habitacionService.findOne(updateEstadiaDto.habitacion_id)
        : estadia.habitacion;
      
      const numero_noches = updateEstadiaDto.numero_noches || estadia.numero_noches;
      estadia.subtotal_habitacion = Number(habitacion.tipo_habitacion.precio_base) * numero_noches;
    }

    Object.assign(estadia, updateEstadiaDto);
    return await this.estadiaRepository.save(estadia);
  }

  async remove(id: number): Promise<void> {
    const estadia = await this.findOne(id);
    
    // Liberar habitación
    await this.habitacionService.updateDisponibilidad(estadia.habitacion_id, true);
    
    await this.estadiaRepository.remove(estadia);
  }
}