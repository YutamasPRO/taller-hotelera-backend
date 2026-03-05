import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ConsumoService } from './consumo.service';
import { CreateConsumoDto } from './dto/create-consumo.dto';
import { UpdateConsumoDto } from './dto/update-consumo.dto';

@Controller('consumos')
export class ConsumoController {
  constructor(private readonly consumoService: ConsumoService) {}

  @Post()
  create(@Body() createConsumoDto: CreateConsumoDto) {
    return this.consumoService.create(createConsumoDto);
  }

  @Get()
  findAll() {
    return this.consumoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consumoService.findOne(id);
  }

  @Get('estadia/:estadia_id')
  findByEstadia(@Param('estadia_id', ParseIntPipe) estadia_id: number) {
    return this.consumoService.findByEstadia(estadia_id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConsumoDto: UpdateConsumoDto,
  ) {
    return this.consumoService.update(id, updateConsumoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.consumoService.remove(id);
  }
}