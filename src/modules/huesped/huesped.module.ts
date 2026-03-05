import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Huesped } from './entities/huesped.entity';
import { HuespedService } from './huesped.service';
import { HuespedController } from './huesped.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Huesped])],
  controllers: [HuespedController],
  providers: [HuespedService],
  exports: [HuespedService],
})
export class HuespedModule {}