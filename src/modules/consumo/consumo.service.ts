import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
//import { Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumo } from './entities/consumo.entity';
import { CreateConsumoDto } from './dto/create-consumo.dto';
import { UpdateConsumoDto } from './dto/update-consumo.dto';
import { EstadiaService } from '../estadia/estadia.service';

@Injectable()
export class ConsumoService {
  constructor(
  @InjectRepository(Consumo)
  private consumoRepository: Repository<Consumo>,

  @Inject(forwardRef(() => EstadiaService))
  private estadiaService: EstadiaService,
) {}

  async create(createConsumoDto: CreateConsumoDto): Promise<Consumo> {
    // Verificar que la estadía existe
    await this.estadiaService.findOne(createConsumoDto.estadia_id);

    const consumo = this.consumoRepository.create(createConsumoDto);
    return await this.consumoRepository.save(consumo);
  }

  async findAll(): Promise<Consumo[]> {
    return await this.consumoRepository.find({
      relations: ['estadia'],
    });
  }

  async findOne(id: number): Promise<Consumo> {
    const consumo = await this.consumoRepository.findOne({
      where: { id },
      relations: ['estadia'],
    });
    if (!consumo) {
      throw new NotFoundException(`Consumo con ID ${id} no encontrado`);
    }
    return consumo;
  }

  async findByEstadia(estadia_id: number): Promise<Consumo[]> {
    return await this.consumoRepository.find({
      where: { estadia_id },
      order: { fecha: 'ASC' },
    });
  }

  async update(id: number, updateConsumoDto: UpdateConsumoDto): Promise<Consumo> {
    const consumo = await this.findOne(id);
    
    if (updateConsumoDto.estadia_id) {
      await this.estadiaService.findOne(updateConsumoDto.estadia_id);
    }
    
    Object.assign(consumo, updateConsumoDto);
    return await this.consumoRepository.save(consumo);
  }

  async remove(id: number): Promise<void> {
    const consumo = await this.findOne(id);
    await this.consumoRepository.remove(consumo);
  }

  async calcularTotalConsumos(estadia_id: number): Promise<number> {
    const consumos = await this.findByEstadia(estadia_id);
    return consumos.reduce((total, consumo) => total + Number(consumo.precio), 0);
  }
}