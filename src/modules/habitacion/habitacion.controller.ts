import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { HabitacionService } from './habitacion.service';
import { CreateHabitacionDto } from './dto/create-habitacion.dto';
import { UpdateHabitacionDto } from './dto/update-habitacion.dto';

@Controller('habitaciones')
export class HabitacionController {
  constructor(private readonly habitacionService: HabitacionService) {}

  @Post()
  create(@Body() createHabitacionDto: CreateHabitacionDto) {
    return this.habitacionService.create(createHabitacionDto);
  }

  @Get()
  findAll() {
    return this.habitacionService.findAll();
  }

  @Get('disponibles')
  findDisponibles() {
    return this.habitacionService.findDisponibles();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionService.findOne(id);
  }

  @Get('numero/:numero')
  findByNumero(@Param('numero') numero: string) {
    return this.habitacionService.findByNumero(numero);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHabitacionDto: UpdateHabitacionDto,
  ) {
    return this.habitacionService.update(id, updateHabitacionDto);
  }

  @Put(':id/disponibilidad/:disponible')
  updateDisponibilidad(
    @Param('id', ParseIntPipe) id: number,
    @Param('disponible') disponible: string,
  ) {
    const disponibleBool = disponible === 'true';
    return this.habitacionService.updateDisponibilidad(id, disponibleBool);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionService.remove(id);
  }
}