import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estadia } from './entities/estadia.entity';
import { EstadiaService } from './estadia.service';
import { EstadiaController } from './estadia.controller';
import { HuespedModule } from '../huesped/huesped.module';
import { HabitacionModule } from '../habitacion/habitacion.module';
import { ConsumoModule } from '../consumo/consumo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estadia]),
    HuespedModule,
    HabitacionModule,
    forwardRef(() => ConsumoModule), // Usar forwardRef para evitar dependencia circular
  ],
  controllers: [EstadiaController],
  providers: [EstadiaService],
  exports: [EstadiaService],
})
export class EstadiaModule {}