import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
//import { Estadia } from '../../estadia/entities/estadia.entity';
import { Estadia } from 'src/modules/estadia/entities/estadia.entity';

@Entity('consumos')
export class Consumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column()
  estadia_id: number;

  @ManyToOne(() => Estadia, estadia => estadia.consumos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estadia_id' })
  estadia: Estadia;
}