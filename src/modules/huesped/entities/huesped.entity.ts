import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
//import { Estadia } from '../../estadia/entities/estadia.entity';
import { Estadia } from 'src/modules/estadia/entities/estadia.entity';

@Entity('huespedes')
export class Huesped {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 20, unique: true })
  documento_identidad: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 200, nullable: true })
  direccion: string;

  @Column({ nullable: true })
  fecha_nacimiento: Date;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Estadia, estadia => estadia.huesped)
  estadias: Estadia[];
}