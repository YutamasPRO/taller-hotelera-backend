import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { HuespedService } from './huesped.service';
import { CreateHuespedDto } from './dto/create-huesped.dto';
import { UpdateHuespedDto } from './dto/update-huesped.dto';

@Controller('huespedes')
export class HuespedController {
  constructor(private readonly huespedService: HuespedService) {}

  @Post()
  create(@Body() createHuespedDto: CreateHuespedDto) {
    return this.huespedService.create(createHuespedDto);
  }

  @Get()
  findAll() {
    return this.huespedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.huespedService.findOne(id);
  }

  @Get('documento/:documento')
  findByDocumento(@Param('documento') documento: string) {
    return this.huespedService.findByDocumento(documento);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHuespedDto: UpdateHuespedDto,
  ) {
    return this.huespedService.update(id, updateHuespedDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.huespedService.remove(id);
  }
}