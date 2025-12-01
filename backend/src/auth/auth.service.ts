import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async registro(nombre: string, email: string, password: string, telefono?: string, direccion?: string) {
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      throw new Error('El email ya está registrado');
    }

    const usuarioExistentePorNombre = await this.usuariosRepository.findOne({
      where: { nombre },
    });

    if (usuarioExistentePorNombre) {
      throw new Error('El nombre de usuario ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = this.usuariosRepository.create({
      nombre,
      email,
      password: hashedPassword,
      telefono,
      direccion,
      rol: 'vendedor',
    });

    await this.usuariosRepository.save(usuario);

    const token = this.jwtService.sign({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return {
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async login(username: string, password: string) {
    const usuario = await this.usuariosRepository.findOne({
      where: { nombre: username },
    });

    if (!usuario) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    const esValido = await bcrypt.compare(password, usuario.password);

    if (!esValido) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    if (!usuario.activo) {
      throw new Error('Tu cuenta ha sido desactivada');
    }

    const token = this.jwtService.sign({
      id: usuario.id,
      username: usuario.nombre,
      rol: usuario.rol,
    });

    return {
      mensaje: 'Sesión iniciada exitosamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}
