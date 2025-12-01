import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async seed() {
    // Verificar si ya existen usuarios
    const usuariosCount = await this.usuariosRepository.count();

    if (usuariosCount > 0) {
      return;
    }

    // Crear usuario admin con username 'admin' y password 'admin'
    const adminPassword = await bcrypt.hash('admin', 10);
    const admin = this.usuariosRepository.create({
      nombre: 'admin',
      email: 'admin@tienda.com',
      password: adminPassword,
      rol: 'admin',
      activo: true,
      telefono: '1234567890',
      direccion: 'Calle Principal 123',
    });

    await this.usuariosRepository.save(admin);

    // Crear vendedor con username 'vendedor' y password '1234'
    const vendedorPassword = await bcrypt.hash('1234', 10);
    const vendedor = this.usuariosRepository.create({
      nombre: 'vendedor',
      email: 'vendedor@tienda.com',
      password: vendedorPassword,
      rol: 'vendedor',
      activo: true,
      telefono: '1234567890',
      direccion: 'Tienda - vendedor',
    });

    await this.usuariosRepository.save(vendedor);
    // Seed completado
  }
}
