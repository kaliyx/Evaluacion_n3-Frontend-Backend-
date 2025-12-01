import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async crear(producto: Partial<Producto>, _usuarioId: number, rol?: string) {
    if (rol !== 'admin') {
      throw new ForbiddenException('Solo el admin puede crear productos');
    }
    const nuevoProducto = this.productosRepository.create(producto);
    return this.productosRepository.save(nuevoProducto);
  }

  async obtener() {
    // Todos ven todos los productos (activos)
    return this.productosRepository.find({
      where: { estado: 'activo' },
    });
  }

  async obtenerPorId(id: number) {
    return this.productosRepository.findOne({
      where: { id, estado: 'activo' },
    });
  }

  async actualizar(id: number, producto: Partial<Producto>, rol?: string) {
    if (rol !== 'admin') {
      throw new ForbiddenException('Solo el admin puede editar productos');
    }

    const productoExistente = await this.productosRepository.findOne({
      where: { id },
    });

    if (!productoExistente) {
      throw new BadRequestException('Producto no encontrado');
    }

    await this.productosRepository.update(id, producto);
    return this.productosRepository.findOne({ where: { id } });
  }

  async eliminar(id: number, rol?: string) {
    if (rol !== 'admin') {
      throw new ForbiddenException('Solo el admin puede eliminar productos');
    }

    const producto = await this.productosRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new BadRequestException('Producto no encontrado');
    }

    await this.productosRepository.delete(id);
    return { mensaje: 'Producto eliminado exitosamente' };
  }
}
