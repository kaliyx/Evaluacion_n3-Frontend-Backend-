import { Controller, Get, Post, Put, Delete, Body, Param, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';

@Controller('api/productos')
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  // Upload image endpoint: saves to /uploads and returns path
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req: any, _file: any, cb: (error: Error | null, destination: string) => void) => {
          const uploadPath = 'uploads';
          if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (_req: any, file: { originalname: string; fieldname: string }, cb: (error: Error | null, filename: string) => void) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { url: '' };
    return { url: `/uploads/${file.filename}` };
  }

  @Post()
  async crear(@Body() createProductoDto: CreateProductoDto, @Request() req: any) {
    const created = await this.productosService.crear(createProductoDto, req.usuario?.id, req.usuario?.rol);
    // Asegurar que la URL de la imagen sea absoluta para que el frontend pueda cargarla
    if (created && created.imagen && typeof created.imagen === 'string' && created.imagen.startsWith('/')) {
      const host = req.get('host');
      const protocol = req.protocol;
      (created as any).imagen = `${protocol}://${host}${created.imagen}`;
    }
    return created;
  }

  @Get()
  async obtener(@Request() req: any) {
    const productos = await this.productosService.obtener();
    const host = req.get('host');
    const protocol = req.protocol;
    return productos.map((p: any) => {
      if (p && p.imagen && typeof p.imagen === 'string' && p.imagen.startsWith('/')) {
        p.imagen = `${protocol}://${host}${p.imagen}`;
      }
      return p;
    });
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number, @Request() req: any) {
    const producto = await this.productosService.obtenerPorId(id);
    if (producto && producto.imagen && typeof producto.imagen === 'string' && producto.imagen.startsWith('/')) {
      const host = req.get('host');
      const protocol = req.protocol;
      (producto as any).imagen = `${protocol}://${host}${producto.imagen}`;
    }
    return producto;
  }

  @Put(':id')
  async actualizar(@Param('id') id: number, @Body() updateProductoDto: UpdateProductoDto, @Request() req: any) {
    const updated = await this.productosService.actualizar(id, updateProductoDto, req.usuario?.rol);
    if (updated && updated.imagen && typeof updated.imagen === 'string' && updated.imagen.startsWith('/')) {
      const host = req.get('host');
      const protocol = req.protocol;
      (updated as any).imagen = `${protocol}://${host}${updated.imagen}`;
    }
    return updated;
  }

  @Delete(':id')
  async eliminar(@Param('id') id: number, @Request() req: any) {
    return this.productosService.eliminar(id, req.usuario?.rol);
  }
}

