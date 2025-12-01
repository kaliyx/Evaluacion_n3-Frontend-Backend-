import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { Producto } from '../productos/producto.entity';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async crearVenta(createVentaDto: CreateVentaDto, vendedorId: number) {
    const venta = new Venta();
    venta.vendedor_id = vendedorId;
    venta.estado = 'pendiente';

    let subtotal = 0;
    const detalles = [];

    for (const item of createVentaDto.items) {
      const producto = await this.productosRepository.findOne({
        where: { id: item.producto_id },
      });

      if (!producto) {
        throw new BadRequestException(`Producto ${item.producto_id} no encontrado`);
      }

      if (producto.stock < item.cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${producto.nombre}`);
      }

      const detalle = new DetalleVenta();
      detalle.producto_id = producto.id;
      detalle.cantidad = item.cantidad;
      detalle.precio_unitario = producto.precio;
      detalle.subtotal = producto.precio * item.cantidad;

      detalles.push(detalle);
      subtotal += detalle.subtotal;

      // Descontar stock
      producto.stock -= item.cantidad;
      await this.productosRepository.save(producto);
    }

    venta.subtotal = subtotal;
    venta.impuesto = subtotal * 0.19; // 19% IVA
    venta.total = subtotal + venta.impuesto;
    venta.detalles = detalles;

    const ventaGuardada = await this.ventasRepository.save(venta);

    return {
      id: ventaGuardada.id,
      vendedor_id: ventaGuardada.vendedor_id,
      subtotal: ventaGuardada.subtotal,
      impuesto: ventaGuardada.impuesto,
      total: ventaGuardada.total,
      estado: ventaGuardada.estado,
      createdAt: ventaGuardada.createdAt,
    };
  }

  async completarVenta(ventaId: number, usuarioId: number) {
    const venta = await this.ventasRepository.findOne({
      where: { id: ventaId },
      relations: ['detalles'],
    });

    if (!venta) {
      throw new BadRequestException('Venta no encontrada');
    }

    if (venta.vendedor_id !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para completar esta venta');
    }

    venta.estado = 'completada';
    return this.ventasRepository.save(venta);
  }

  async obtenerVentasAdmin() {
    return this.ventasRepository.find({
      relations: ['detalles', 'detalles.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  async obtenerVentasVendedor(vendedorId: number) {
    return this.ventasRepository.find({
      where: { vendedor_id: vendedorId },
      relations: ['detalles', 'detalles.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  async obtenerVentasPorFecha(fecha: string) {
    const startDate = new Date(fecha);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(fecha);
    endDate.setHours(23, 59, 59, 999);

    return this.ventasRepository
      .createQueryBuilder('venta')
      .where('venta.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('venta.estado = :estado', { estado: 'completada' })
      .leftJoinAndSelect('venta.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto')
      .orderBy('venta.createdAt', 'DESC')
      .getMany();
  }

  async obtenerResumenVentas(fecha: string) {
    const ventas = await this.obtenerVentasPorFecha(fecha);

    const totalVentas = ventas.reduce((sum, venta) => sum + parseFloat(venta.total.toString()), 0);
    const totalImpuesto = ventas.reduce((sum, venta) => sum + parseFloat(venta.impuesto.toString()), 0);
    const cantidadVentas = ventas.length;

    const ventasPorVendedor: Record<number, any> = {};
    ventas.forEach((venta) => {
      if (!ventasPorVendedor[venta.vendedor_id]) {
        ventasPorVendedor[venta.vendedor_id] = {
          vendedor_id: venta.vendedor_id,
          cantidad: 0,
          total: 0,
        };
      }
      ventasPorVendedor[venta.vendedor_id].cantidad += 1;
      ventasPorVendedor[venta.vendedor_id].total += parseFloat(venta.total.toString());
    });

    return {
      fecha,
      totalVentas: parseFloat(totalVentas.toFixed(2)),
      totalImpuesto: parseFloat(totalImpuesto.toFixed(2)),
      cantidadVentas,
      ventasPorVendedor: Object.values(ventasPorVendedor),
      detalleVentas: ventas,
    };
  }

  async cancelarVenta(ventaId: number, usuarioId: number) {
    const venta = await this.ventasRepository.findOne({
      where: { id: ventaId },
      relations: ['detalles', 'detalles.producto'],
    });

    if (!venta) {
      throw new BadRequestException('Venta no encontrada');
    }

    if (venta.vendedor_id !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para cancelar esta venta');
    }

    // Retornar stock
    for (const detalle of venta.detalles) {
      const producto = await this.productosRepository.findOne({
        where: { id: detalle.producto_id },
      });
      if (producto) {
        producto.stock += detalle.cantidad;
        await this.productosRepository.save(producto);
      }
    }

    venta.estado = 'cancelada';
    return this.ventasRepository.save(venta);
  }
}
