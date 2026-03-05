import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Huesped } from '../../huesped/entities/huesped.entity';
import { Habitacion } from '../../habitacion/entities/habitacion.entity';
import { Consumo } from '../../consumo/entities/consumo.entity';

@Entity('estadias')
export class Estadia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  fecha_checkin: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_checkout: Date;

  @Column()
  numero_noches: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  subtotal_habitacion: number;

  @Column({ default: true })
  activa: boolean;

  @Column()
  huesped_id: number;

  @Column()
  habitacion_id: number;

  @ManyToOne(() => Huesped, huesped => huesped.estadias)
  @JoinColumn({ name: 'huesped_id' })
  huesped: Huesped;

  @ManyToOne(() => Habitacion, habitacion => habitacion.estadias)
  @JoinColumn({ name: 'habitacion_id' })
  habitacion: Habitacion;

  @OneToMany(() => Consumo, consumo => consumo.estadia)
  consumos: Consumo[];
}