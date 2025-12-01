import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tienda_ropa',
  entities: [Usuario, Producto],
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
  charset: 'utf8mb4',
};
