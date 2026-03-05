import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { TipoHabitacionModule } from './modules/tipo-habitacion/tipo-habitacion.module';
import { HabitacionModule } from './modules/habitacion/habitacion.module';
import { HuespedModule } from './modules/huesped/huesped.module';
import { EstadiaModule } from './modules/estadia/estadia.module';
import { ConsumoModule } from './modules/consumo/consumo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TipoHabitacionModule,
    HabitacionModule,
    HuespedModule,
    EstadiaModule,
    ConsumoModule,
  ],
})
export class AppModule {} 