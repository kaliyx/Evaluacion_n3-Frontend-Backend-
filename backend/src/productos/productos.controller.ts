import { Controller, Get, Post, Put, Delete, Body, Param, Request, UploadedFile, UseInterceptors, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
        destination: (req, file, cb) => {
          const uploadPath = 'uploads';
          if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
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
    try {
      return await this.productosService.crear(createProductoDto, req.usuario?.id, req.usuario?.rol);
    } catch (error: any) {
      console.error('Error creando producto:', error);
      // Re-lanzar excepciones conocidas para que Nest las maneje correctamente
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      // Si el servicio arrojó una excepción con mensaje, devolverlo como BadRequest
      const message = error?.message || 'Error al crear producto';
      throw new BadRequestException(message);
    }
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

