import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../productos/producto.entity';

@Injectable()
export class ProductoSeedService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async seed() {
    const productosCount = await this.productosRepository.count();

    if (productosCount > 0) {
      console.log('Productos ya existen. Seed de productos omitido.');
      return;
    }

    console.log('Iniciando seed de productos...');

    const productos = [
      // Productos para hombres
      {
        nombre: 'Camiseta Básica Azul',
        descripcion: 'Camiseta 100% algodón de alta calidad, perfecta para uso diario',
        precio: 29.99,
        stock: 50,
        categoria: 'hombres',
        imagen: 'https://via.placeholder.com/300x300?text=Camiseta+Azul',
        estado: 'activo',
        vendedor_id: 1,
      },
      {
        nombre: 'Pantalón Vaquero Negro',
        descripcion: 'Pantalón vaquero resistente con acabado premium',
        precio: 79.99,
        stock: 30,
        categoria: 'hombres',
        imagen: 'https://via.placeholder.com/300x300?text=Pantalon+Negro',
        estado: 'activo',
        vendedor_id: 1,
      },
      // Productos para mujeres
      {
        nombre: 'Blusa Rosa Casual',
        descripcion: 'Blusa casual en color rosa ideal para cualquier ocasión',
        precio: 39.99,
        stock: 45,
        categoria: 'mujeres',
        imagen: 'https://via.placeholder.com/300x300?text=Blusa+Rosa',
        estado: 'activo',
        vendedor_id: 2,
      },
      {
        nombre: 'Falda Negra Elegante',
        descripcion: 'Falda negra elegante para eventos y uso profesional',
        precio: 59.99,
        stock: 25,
        categoria: 'mujeres',
        imagen: 'https://via.placeholder.com/300x300?text=Falda+Negra',
        estado: 'activo',
        vendedor_id: 2,
      },
      // Productos para niños
      {
        nombre: 'Camiseta Dinosaurio Niños',
        descripcion: 'Camiseta divertida con diseño de dinosaurio para niños',
        precio: 19.99,
        stock: 60,
        categoria: 'niños',
        imagen: 'https://via.placeholder.com/300x300?text=Camiseta+Dino',
        estado: 'activo',
        vendedor_id: 3,
      },
      {
        nombre: 'Pantalón Deportivo Niños',
        descripcion: 'Pantalón cómodo para actividades deportivas infantiles',
        precio: 34.99,
        stock: 40,
        categoria: 'niños',
        imagen: 'https://via.placeholder.com/300x300?text=Pantalon+Sport',
        estado: 'activo',
        vendedor_id: 3,
      },
      // Accesorios
      {
        nombre: 'Gorra Deportiva',
        descripcion: 'Gorra ajustable perfecta para actividades deportivas',
        precio: 24.99,
        stock: 100,
        categoria: 'accesorios',
        imagen: 'https://via.placeholder.com/300x300?text=Gorra',
        estado: 'activo',
        vendedor_id: 1,
      },
      {
        nombre: 'Cinturón Piel',
        descripcion: 'Cinturón de cuero genuino de alta calidad',
        precio: 44.99,
        stock: 35,
        categoria: 'accesorios',
        imagen: 'https://via.placeholder.com/300x300?text=Cinturon',
        estado: 'activo',
        vendedor_id: 2,
      },
    ];

    for (const producto of productos) {
      const nuevoProducto = this.productosRepository.create(producto);
      await this.productosRepository.save(nuevoProducto);
      console.log(`✓ Producto creado: ${producto.nombre}`);
    }

    console.log('Seed de productos completado.');
  }
}
