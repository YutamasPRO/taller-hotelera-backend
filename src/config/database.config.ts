import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { TipoHabitacion } from '../modules/tipo-habitacion/entities/tipo-habitacion.entity';
import { Habitacion } from '../modules/habitacion/entities/habitacion.entity';
import { Huesped } from '../modules/huesped/entities/huesped.entity';
//import { Estadia } from '../modules/estadia/entities/estadia.entity';
import { Estadia } from 'src/modules/estadia/entities/estadia.entity';
//import { Consumo } from '../modules/consumo/entities/consumo.entity';
import { Consumo } from 'src/modules/consumo/entities/consumo.entity';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [TipoHabitacion, Habitacion, Huesped, Estadia, Consumo],
  synchronize: false, // Solo para desarrollo
  logging: false,
};