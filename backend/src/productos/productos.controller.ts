import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';

@Controller('api/productos')
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  @Post()
  async crear(@Body() createProductoDto: CreateProductoDto, @Request() req: any) {
    return this.productosService.crear(createProductoDto, req.usuario?.id, req.usuario?.rol);
  }

  @Get()
  async obtener() {
    return this.productosService.obtener();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number) {
    return this.productosService.obtenerPorId(id);
  }

  @Put(':id')
  async actualizar(@Param('id') id: number, @Body() updateProductoDto: UpdateProductoDto, @Request() req: any) {
    return this.productosService.actualizar(id, updateProductoDto, req.usuario?.rol);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number, @Request() req: any) {
    return this.productosService.eliminar(id, req.usuario?.rol);
  }
}

