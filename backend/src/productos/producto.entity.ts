import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  precio: number;

  @Column({ default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: ['hombres', 'mujeres', 'niños', 'accesorios'],
    nullable: false,
  })
  categoria: string;

  @Column({ length: 500, nullable: true })
  imagen: string;

  @Column({
    type: 'enum',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  estado: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.productos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendedor_id' })
  vendedor: Usuario;

  @Column()
  vendedor_id: number;
}
