import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';

// For local development default to SQLite so the backend runs without MySQL.
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: process.env.DB_NAME || 'dev.sqlite',
  entities: [Usuario, Producto],
  synchronize: true,
  logging: false,
};
