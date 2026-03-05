import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TipoHabitacionService } from './tipo-habitacion.service';
import { CreateTipoHabitacionDto } from './dto/create-tipo-habitacion.dto';
import { UpdateTipoHabitacionDto } from './dto/update-tipo-habitacion.dto';

@Controller('tipos-habitacion')
export class TipoHabitacionController {
  constructor(private readonly tipoHabitacionService: TipoHabitacionService) {}

  @Post()
  create(@Body() createTipoHabitacionDto: CreateTipoHabitacionDto) {
    return this.tipoHabitacionService.create(createTipoHabitacionDto);
  }

  @Get()
  findAll() {
    return this.tipoHabitacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoHabitacionService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoHabitacionDto: UpdateTipoHabitacionDto,
  ) {
    return this.tipoHabitacionService.update(id, updateTipoHabitacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoHabitacionService.remove(id);
  }
}