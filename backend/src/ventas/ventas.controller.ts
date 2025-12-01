import { Controller, Post, Get, Param, Body, Request, Query, Put, BadRequestException, ForbiddenException } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';

@Controller('api/ventas')
export class VentasController {
  constructor(private ventasService: VentasService) {}

  @Post()
  async crear(@Body() createVentaDto: CreateVentaDto, @Request() req: any) {
    if (!req.usuario) {
      throw new BadRequestException('Usuario no autenticado');
    }
    
    if (req.usuario.rol !== 'vendedor') {
      throw new ForbiddenException('Solo los vendedores pueden crear ventas');
    }
    
    return this.ventasService.crearVenta(createVentaDto, req.usuario.id);
  }

  @Put(':id/completar')
  async completar(@Param('id') id: number, @Request() req: any) {
    if (!req.usuario) {
      throw new BadRequestException('Usuario no autenticado');
    }
    
    if (req.usuario.rol !== 'vendedor') {
      throw new ForbiddenException('Solo los vendedores pueden completar ventas');
    }
    
    return this.ventasService.completarVenta(id, req.usuario.id);
  }

  @Put(':id/cancelar')
  async cancelar(@Param('id') id: number, @Request() req: any) {
    if (!req.usuario) {
      throw new BadRequestException('Usuario no autenticado');
    }
    
    if (req.usuario.rol !== 'vendedor') {
      throw new ForbiddenException('Solo los vendedores pueden cancelar ventas');
    }
    
    return this.ventasService.cancelarVenta(id, req.usuario.id);
  }

  @Get()
  async obtener(@Request() req: any) {
    if (!req.usuario) {
      throw new BadRequestException('Usuario no autenticado');
    }

    if (req.usuario.rol === 'admin') {
      return this.ventasService.obtenerVentasAdmin();
    }

    return this.ventasService.obtenerVentasVendedor(req.usuario.id);
  }

  @Get('resumen/diario')
  async obtenerResumen(@Query('fecha') fecha: string, @Request() req: any) {
    if (!req.usuario) {
      throw new BadRequestException('Usuario no autenticado');
    }

    if (req.usuario.rol !== 'admin') {
      throw new ForbiddenException('Solo el admin puede ver el resumen');
    }

    if (!fecha) {
      fecha = new Date().toISOString().split('T')[0];
    }

    return this.ventasService.obtenerResumenVentas(fecha);
  }

  @Get(':fecha')
  async obtenerPorFecha(@Param('fecha') fecha: string, @Request() req: any) {
    if (!req.usuario) {
      throw new BadRequestException('Usuario no autenticado');
    }

    if (req.usuario.rol !== 'admin') {
      throw new ForbiddenException('Solo el admin puede consultar por fecha');
    }

    return this.ventasService.obtenerVentasPorFecha(fecha);
  }
}
