import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Usuario } from '../usuarios/usuario.entity';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mockUsuariosRepository: any;

  const mockUsuario = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'hashedPassword123',
    rol: 'vendedor',
    activo: true,
    telefono: '1234567890',
    direccion: 'Calle Principal 123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockUsuariosRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuariosRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token123'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registro', () => {
    it('debería registrar un nuevo usuario correctamente', async () => {
      const usuarioRegistro = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        telefono: '1234567890',
        direccion: 'Calle Principal 123',
      };

      mockUsuariosRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      mockUsuariosRepository.create.mockReturnValue({
        ...usuarioRegistro,
        password: 'hashedPassword123',
        rol: 'vendedor',
      });
      mockUsuariosRepository.save.mockResolvedValue({
        ...mockUsuario,
        ...usuarioRegistro,
      });

      const resultado = await service.registro(
        usuarioRegistro.nombre,
        usuarioRegistro.email,
        usuarioRegistro.password,
        usuarioRegistro.telefono,
        usuarioRegistro.direccion,
      );

      expect(resultado.mensaje).toBe('Usuario registrado exitosamente');
      expect(resultado.token).toBe('token123');
      expect(resultado.usuario.email).toBe(usuarioRegistro.email);
      expect(mockUsuariosRepository.findOne).toHaveBeenNthCalledWith(1, {
        where: { email: usuarioRegistro.email },
      });
      expect(mockUsuariosRepository.findOne).toHaveBeenNthCalledWith(2, {
        where: { nombre: usuarioRegistro.nombre },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(usuarioRegistro.password, 10);
      expect(mockUsuariosRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar error si el email ya existe', async () => {
      const usuarioRegistro = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      mockUsuariosRepository.findOne.mockResolvedValue(mockUsuario);

      await expect(
        service.registro(
          usuarioRegistro.nombre,
          usuarioRegistro.email,
          usuarioRegistro.password,
        ),
      ).rejects.toThrow('El email ya está registrado');
    });

    it('debería encriptar la contraseña correctamente', async () => {
      const password = 'password123';

      mockUsuariosRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUsuariosRepository.create.mockReturnValue({
        nombre: 'Juan',
        email: 'juan@example.com',
        password: 'hashedPassword',
        rol: 'vendedor',
      });
      mockUsuariosRepository.save.mockResolvedValue({
        ...mockUsuario,
        password: 'hashedPassword',
      });

      await service.registro('Juan', 'juan@example.com', password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente', async () => {
      const loginData = {
        username: 'Juan Pérez',
        password: 'password123',
      };

      mockUsuariosRepository.findOne.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const resultado = await service.login(loginData.username, loginData.password);

      expect(resultado.mensaje).toBe('Sesión iniciada exitosamente');
      expect(resultado.token).toBe('token123');
      expect(resultado.usuario.nombre).toBe(loginData.username);
      expect(mockUsuariosRepository.findOne).toHaveBeenCalledWith({
        where: { nombre: loginData.username },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUsuario.password,
      );
    });

    it('debería lanzar error si el email no existe', async () => {
      mockUsuariosRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login('noexiste', 'password123'),
      ).rejects.toThrow('Usuario o contraseña incorrectos');
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {
      mockUsuariosRepository.findOne.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('Juan Pérez', 'passwordIncorrecto'),
      ).rejects.toThrow('Usuario o contraseña incorrectos');
    });

    it('debería lanzar error si el usuario está inactivo', async () => {
      mockUsuariosRepository.findOne.mockResolvedValue({
        ...mockUsuario,
        activo: false,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.login('Juan Pérez', 'password123'),
      ).rejects.toThrow('Tu cuenta ha sido desactivada');
    });

    it('debería generar un JWT válido', async () => {
      mockUsuariosRepository.findOne.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await service.login('Juan Pérez', 'password123');

      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUsuario.id,
        username: mockUsuario.nombre,
        rol: mockUsuario.rol,
      });
    });
  });

  describe('casos extremos', () => {
    it('debería manejar errores de base de datos en registro', async () => {
      mockUsuariosRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.registro('Juan', 'juan@example.com', 'password123'),
      ).rejects.toThrow('Database error');
    });

    it('debería manejar errores de base de datos en login', async () => {
      mockUsuariosRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.login('Juan Pérez', 'password123'),
      ).rejects.toThrow('Database error');
    });

    it('debería registrar usuario sin teléfono y dirección', async () => {
      const usuarioRegistro = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      mockUsuariosRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      mockUsuariosRepository.create.mockReturnValue({
        ...usuarioRegistro,
        password: 'hashedPassword123',
        rol: 'vendedor',
      });
      mockUsuariosRepository.save.mockResolvedValue({
        ...mockUsuario,
        ...usuarioRegistro,
      });

      const resultado = await service.registro(
        usuarioRegistro.nombre,
        usuarioRegistro.email,
        usuarioRegistro.password,
      );

      expect(resultado.usuario.nombre).toBe(usuarioRegistro.nombre);
      expect(mockUsuariosRepository.save).toHaveBeenCalled();
    });
  });
});
