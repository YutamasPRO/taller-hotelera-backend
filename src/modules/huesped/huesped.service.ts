import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Huesped } from './entities/huesped.entity';
import { CreateHuespedDto } from './dto/create-huesped.dto';
import { UpdateHuespedDto } from './dto/update-huesped.dto';

@Injectable()
export class HuespedService {
  constructor(
    @InjectRepository(Huesped)
    private huespedRepository: Repository<Huesped>,
  ) {}

  async create(createHuespedDto: CreateHuespedDto): Promise<Huesped> {
    const huesped = this.huespedRepository.create(createHuespedDto);
    return await this.huespedRepository.save(huesped);
  }

  async findAll(): Promise<Huesped[]> {
    return await this.huespedRepository.find({
      where: { activo: true },
    });
  }

  async findOne(id: number): Promise<Huesped> {
    const huesped = await this.huespedRepository.findOne({
      where: { id },
      relations: ['estadias', 'estadias.consumos'],
    });
    if (!huesped) {
      throw new NotFoundException(`Huésped con ID ${id} no encontrado`);
    }
    return huesped;
  }

  async findByDocumento(documento_identidad: string): Promise<Huesped> {
    const huesped = await this.huespedRepository.findOne({
      where: { documento_identidad },
    });
    if (!huesped) {
      throw new NotFoundException(`Huésped con documento ${documento_identidad} no encontrado`);
    }
    return huesped;
  }

  async update(id: number, updateHuespedDto: UpdateHuespedDto): Promise<Huesped> {
    const huesped = await this.findOne(id);
    Object.assign(huesped, updateHuespedDto);
    return await this.huespedRepository.save(huesped);
  }

  async remove(id: number): Promise<void> {
    const huesped = await this.findOne(id);
    huesped.activo = false;
    await this.huespedRepository.save(huesped);
  }
}