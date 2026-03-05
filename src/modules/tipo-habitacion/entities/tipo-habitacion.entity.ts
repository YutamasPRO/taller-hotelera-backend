import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Habitacion } from '../../habitacion/entities/habitacion.entity';

@Entity('tipos_habitacion')
export class TipoHabitacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_base: number;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Habitacion, habitacion => habitacion.tipo_habitacion)
  habitaciones: Habitacion[];
}