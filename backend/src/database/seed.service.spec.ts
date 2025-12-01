import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Usuario } from '../usuarios/usuario.entity';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('SeedService', () => {
  let service: SeedService;
  let mockUsuariosRepository: any;

  beforeEach(async () => {
    mockUsuariosRepository = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuariosRepository,
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('seed', () => {
    it('debería omitir seed si ya existen usuarios', async () => {
      mockUsuariosRepository.count.mockResolvedValue(4); // Ya hay usuarios

      await service.seed();

      expect(mockUsuariosRepository.create).not.toHaveBeenCalled();
      expect(mockUsuariosRepository.save).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        'Base de datos ya contiene usuarios. Seed omitido.',
      );
    });

    it('debería crear un admin con password hasheado', async () => {
      mockUsuariosRepository.count.mockResolvedValue(0);
      const hashedPassword = 'hashedadmin123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const mockAdmin = {
        nombre: 'admin',
        email: 'admin@tienda.com',
        password: hashedPassword,
        rol: 'admin',
        activo: true,
        telefono: '1234567890',
        direccion: 'Calle Principal 123',
      };

      mockUsuariosRepository.create.mockReturnValueOnce(mockAdmin);
      mockUsuariosRepository.save.mockResolvedValueOnce(mockAdmin);

      // mock para vendedor
      mockUsuariosRepository.create.mockReturnValueOnce({
        nombre: 'vendedor',
        email: 'vendedor@tienda.com',
        password: hashedPassword,
        rol: 'vendedor',
        activo: true,
      });
      mockUsuariosRepository.save.mockResolvedValueOnce({
        nombre: 'vendedor',
      });

      await service.seed();

      expect(bcrypt.hash).toHaveBeenCalledWith('admin', 10);
      expect(mockUsuariosRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'admin',
          email: 'admin@tienda.com',
          rol: 'admin',
          activo: true,
        }),
      );
    });

    it('debería crear 2 usuarios (admin y vendedor)', async () => {
      mockUsuariosRepository.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      mockUsuariosRepository.create.mockReturnValue({
        nombre: 'Test',
        email: 'test@tienda.com',
        password: 'hashedpassword',
        rol: 'vendedor',
        activo: true,
      });
      mockUsuariosRepository.save.mockResolvedValue({
        id: 1,
        nombre: 'Test',
      });

      await service.seed();

      // 1 admin + 1 vendedor = 2 calls a create
      expect(mockUsuariosRepository.create).toHaveBeenCalledTimes(2);
      expect(mockUsuariosRepository.save).toHaveBeenCalledTimes(2);
    });

    it('debería crear usuarios con rol correcto', async () => {
      mockUsuariosRepository.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      mockUsuariosRepository.create.mockReturnValue({
        nombre: 'Test',
        email: 'test@tienda.com',
        password: 'hashedpassword',
        rol: 'vendedor',
        activo: true,
      });
      mockUsuariosRepository.save.mockResolvedValue({
        id: 1,
      });

      await service.seed();

      const calls = mockUsuariosRepository.create.mock.calls;
      expect(calls[0][0]).toMatchObject({ rol: 'admin', activo: true });
      expect(calls[1][0]).toMatchObject({ rol: 'vendedor', activo: true });
    });

    it('debería asignar contraseñas hasheadas a todos los usuarios', async () => {
      mockUsuariosRepository.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      mockUsuariosRepository.create.mockReturnValue({
        nombre: 'Test',
        password: 'hashedpassword',
      });
      mockUsuariosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      // 1 admin + 1 vendedor = 2 bcrypt.hash calls
      expect(bcrypt.hash).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('admin', 10);
      expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
    });

    it('debería guardar todos los usuarios en la base de datos', async () => {
      mockUsuariosRepository.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      mockUsuariosRepository.create.mockReturnValue({
        nombre: 'Test',
        email: 'test@tienda.com',
        password: 'hashedpassword',
      });
      mockUsuariosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      expect(mockUsuariosRepository.save).toHaveBeenCalledTimes(2);
    });

    it('debería crear usuarios con campos requeridos', async () => {
      mockUsuariosRepository.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      mockUsuariosRepository.create.mockReturnValue({
        nombre: 'Test',
        email: 'test@tienda.com',
        password: 'hashedpassword',
        rol: 'vendedor',
        activo: true,
        telefono: '1234567890',
        direccion: 'Test direccion',
      });
      mockUsuariosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      const allCalls = mockUsuariosRepository.create.mock.calls;
      for (const call of allCalls) {
        expect(call[0]).toHaveProperty('nombre');
        expect(call[0]).toHaveProperty('email');
        expect(call[0]).toHaveProperty('password');
        expect(call[0]).toHaveProperty('rol');
        expect(call[0]).toHaveProperty('activo');
      }
    });

    it('debería loguear cuando el seed se complete', async () => {
      mockUsuariosRepository.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      mockUsuariosRepository.create.mockReturnValue({
        nombre: 'Test',
      });
      mockUsuariosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      expect(console.log).toHaveBeenCalledWith('Seed completado exitosamente.');
    });
  });
});
