import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EstadiaService } from './estadia.service';
import { CreateEstadiaDto } from './dto/create-estadia.dto';
import { UpdateEstadiaDto } from './dto/update-estadia.dto';
import { RegistrarConsumoDto } from './dto/registrar-consumo.dto';

@Controller('estadias')
export class EstadiaController {
  constructor(private readonly estadiaService: EstadiaService) {}

  @Post()
  create(@Body() createEstadiaDto: CreateEstadiaDto) {
    return this.estadiaService.create(createEstadiaDto);
  }

  @Get()
  findAll() {
    return this.estadiaService.findAll();
  }

  @Get('activas')
  findActivas() {
    return this.estadiaService.findActivas();
  }

  @Get('huesped/:huesped_id')
  findByHuesped(@Param('huesped_id', ParseIntPipe) huesped_id: number) {
    return this.estadiaService.findByHuesped(huesped_id);
  }

  @Get('cuenta/:huesped_id')
  obtenerCuentaHuesped(@Param('huesped_id', ParseIntPipe) huesped_id: number) {
    return this.estadiaService.obtenerCuentaHuesped(huesped_id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estadiaService.findOne(id);
  }

  @Post(':id/consumos')
  registrarConsumo(
    @Param('id', ParseIntPipe) id: number,
    @Body() registrarConsumoDto: RegistrarConsumoDto,
  ) {
    return this.estadiaService.registrarConsumo(id, registrarConsumoDto);
  }

  @Put(':id/checkout')
  realizarCheckout(@Param('id', ParseIntPipe) id: number) {
    return this.estadiaService.realizarCheckout(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadiaDto: UpdateEstadiaDto,
  ) {
    return this.estadiaService.update(id, updateEstadiaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estadiaService.remove(id);
  }
}