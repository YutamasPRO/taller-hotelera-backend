import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumo } from './entities/consumo.entity';
import { ConsumoService } from './consumo.service';
import { ConsumoController } from './consumo.controller';
import { EstadiaModule } from '../estadia/estadia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumo]),
    forwardRef(() => EstadiaModule), // Usar forwardRef para evitar dependencia circular
  ],
  controllers: [ConsumoController],
  providers: [ConsumoService],
  exports: [ConsumoService],
})
export class ConsumoModule {}