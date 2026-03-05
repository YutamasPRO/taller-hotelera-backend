import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TipoHabitacion } from '../../tipo-habitacion/entities/tipo-habitacion.entity';
import { Estadia } from '../../estadia/entities/estadia.entity';

@Entity('habitaciones')
export class Habitacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, unique: true })
  numero_habitacion: string;

  @Column()
  piso: number;

  @Column({ default: true })
  disponible: boolean;

  @Column({ nullable: true })
  tipo_habitacion_id: number;

  @ManyToOne(() => TipoHabitacion, tipoHabitacion => tipoHabitacion.habitaciones)
  @JoinColumn({ name: 'tipo_habitacion_id' })
  tipo_habitacion: TipoHabitacion;

  @OneToMany(() => Estadia, estadia => estadia.habitacion)
  estadias: Estadia[];
}