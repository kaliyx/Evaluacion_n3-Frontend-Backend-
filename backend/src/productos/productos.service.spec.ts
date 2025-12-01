import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { Producto } from './producto.entity';

describe('ProductosService', () => {
  let service: ProductosService;
  let mockProductosRepository: any;

  const mockProducto = {
    id: 1,
    nombre: 'Camiseta de Algodón',
    descripcion: 'Camiseta 100% algodón de alta calidad',
    precio: 29.99,
    stock: 50,
    categoria: 'hombres',
    imagen: 'https://example.com/imagen.jpg',
    estado: 'activo',
    vendedor_id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockProductosRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockProductosRepository,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crear', () => {
    it('debería crear un producto correctamente si es admin', async () => {
      const productoData = {
        nombre: 'Camiseta de Algodón',
        descripcion: 'Camiseta 100% algodón',
        precio: 29.99,
        stock: 50,
        categoria: 'hombres',
        imagen: 'https://example.com/imagen.jpg',
      };

      mockProductosRepository.create.mockReturnValue({
        ...productoData,
        id: 1,
      });
      mockProductosRepository.save.mockResolvedValue({
        ...mockProducto,
        ...productoData,
      });

      const resultado = await service.crear(productoData, 1, 'admin');

      expect(resultado.nombre).toBe(productoData.nombre);
      expect(mockProductosRepository.create).toHaveBeenCalledWith(productoData);
      expect(mockProductosRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar ForbiddenException si no es admin', async () => {
      const productoData = {
        nombre: 'Camiseta',
        descripcion: 'Desc',
        precio: 10,
        stock: 5,
        categoria: 'hombres',
      };

      await expect(
        service.crear(productoData, 1, 'vendedor'),
      ).rejects.toThrow('Solo el admin puede crear productos');
    });

    it('debería lanzar ForbiddenException si rol es undefined', async () => {
      const productoData = {
        nombre: 'Camiseta',
        descripcion: 'Desc',
        precio: 10,
        stock: 5,
        categoria: 'hombres',
      };

      await expect(
        service.crear(productoData, 1, undefined),
      ).rejects.toThrow('Solo el admin puede crear productos');
    });
  });

  describe('obtener', () => {
    it('debería obtener todos los productos activos', async () => {
      mockProductosRepository.find.mockResolvedValue([mockProducto]);

      const resultado = await service.obtener();

      expect(resultado).toEqual([mockProducto]);
      expect(mockProductosRepository.find).toHaveBeenCalledWith({
        where: { estado: 'activo' },
      });
    });

    it('debería retornar array vacío si no hay productos activos', async () => {
      mockProductosRepository.find.mockResolvedValue([]);

      const resultado = await service.obtener();

      expect(resultado).toEqual([]);
      expect(mockProductosRepository.find).toHaveBeenCalled();
    });

    it('debería solo traer productos con estado activo', async () => {
      mockProductosRepository.find.mockResolvedValue([mockProducto]);

      await service.obtener();

      expect(mockProductosRepository.find).toHaveBeenCalledWith({
        where: { estado: 'activo' },
      });
    });
  });

  describe('obtenerPorId', () => {
    it('debería obtener un producto por ID', async () => {
      mockProductosRepository.findOne.mockResolvedValue(mockProducto);

      const resultado = await service.obtenerPorId(1);

      expect(resultado).toEqual(mockProducto);
      expect(mockProductosRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, estado: 'activo' },
      });
    });

    it('debería retornar null si el producto no existe', async () => {
      mockProductosRepository.findOne.mockResolvedValue(null);

      const resultado = await service.obtenerPorId(999);

      expect(resultado).toBeNull();
      expect(mockProductosRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, estado: 'activo' },
      });
    });

    it('debería filtrar solo productos activos', async () => {
      mockProductosRepository.findOne.mockResolvedValue(mockProducto);

      await service.obtenerPorId(1);

      expect(mockProductosRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, estado: 'activo' },
      });
    });
  });

  describe('actualizar', () => {
    it('debería actualizar un producto si es admin', async () => {
      const actualizacion = { nombre: 'Camiseta Actualizada' };
      const productoActualizado = { ...mockProducto, ...actualizacion };

      mockProductosRepository.findOne.mockResolvedValue(mockProducto);
      mockProductosRepository.update.mockResolvedValue({ affected: 1 });
      mockProductosRepository.findOne.mockResolvedValueOnce(mockProducto);
      mockProductosRepository.findOne.mockResolvedValueOnce(productoActualizado);

      const resultado = await service.actualizar(1, actualizacion, 'admin');

      expect(resultado?.nombre).toBe(actualizacion.nombre);
      expect(mockProductosRepository.update).toHaveBeenCalledWith(1, actualizacion);
    });

    it('debería lanzar ForbiddenException si no es admin', async () => {
      const actualizacion = { nombre: 'Nuevo nombre' };

      await expect(
        service.actualizar(1, actualizacion, 'vendedor'),
      ).rejects.toThrow('Solo el admin puede editar productos');
    });

    it('debería lanzar ForbiddenException si rol es undefined', async () => {
      const actualizacion = { nombre: 'Nuevo nombre' };

      await expect(
        service.actualizar(1, actualizacion, undefined),
      ).rejects.toThrow('Solo el admin puede editar productos');
    });

    it('debería lanzar BadRequestException si el producto no existe', async () => {
      const actualizacion = { nombre: 'Nuevo nombre' };

      mockProductosRepository.findOne.mockResolvedValue(null);

      await expect(
        service.actualizar(1, actualizacion, 'admin'),
      ).rejects.toThrow('Producto no encontrado');
    });

    it('debería actualizar solo los campos proporcionados', async () => {
      const actualizacion = { stock: 100 };

      mockProductosRepository.findOne.mockResolvedValue(mockProducto);
      mockProductosRepository.update.mockResolvedValue({ affected: 1 });
      mockProductosRepository.findOne.mockResolvedValueOnce({ ...mockProducto, ...actualizacion });

      await service.actualizar(1, actualizacion, 'admin');

      expect(mockProductosRepository.update).toHaveBeenCalledWith(1, actualizacion);
    });
  });

  describe('eliminar', () => {
    it('debería eliminar un producto si es admin', async () => {
      mockProductosRepository.findOne.mockResolvedValue(mockProducto);
      mockProductosRepository.delete.mockResolvedValue({ affected: 1 });

      const resultado = await service.eliminar(1, 'admin');

      expect(resultado.mensaje).toBe('Producto eliminado exitosamente');
      expect(mockProductosRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debería lanzar ForbiddenException si no es admin', async () => {
      await expect(
        service.eliminar(1, 'vendedor'),
      ).rejects.toThrow('Solo el admin puede eliminar productos');
    });

    it('debería lanzar ForbiddenException si rol es undefined', async () => {
      await expect(
        service.eliminar(1, undefined),
      ).rejects.toThrow('Solo el admin puede eliminar productos');
    });

    it('debería lanzar BadRequestException si el producto no existe', async () => {
      mockProductosRepository.findOne.mockResolvedValue(null);

      await expect(
        service.eliminar(1, 'admin'),
      ).rejects.toThrow('Producto no encontrado');
    });

    it('debería manejar error cuando no se puede eliminar', async () => {
      mockProductosRepository.findOne.mockResolvedValue(mockProducto);
      mockProductosRepository.delete.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.eliminar(1, 'admin'),
      ).rejects.toThrow('Database error');
    });
  });

  describe('casos extremos y validaciones', () => {
    it('debería manejar producto con precio negativo', async () => {
      const productoInvalido = {
        nombre: 'Producto',
        descripcion: 'Desc',
        precio: -10,
        stock: 5,
        categoria: 'hombres',
      };

      mockProductosRepository.create.mockReturnValue(productoInvalido);
      mockProductosRepository.save.mockRejectedValue(
        new Error('Precio no válido'),
      );

      await expect(
        service.crear(productoInvalido, 1, 'admin'),
      ).rejects.toThrow('Precio no válido');
    });

    it('debería manejar producto con stock negativo', async () => {
      const productoInvalido = {
        nombre: 'Producto',
        descripcion: 'Desc',
        precio: 10,
        stock: -5,
        categoria: 'hombres',
      };

      mockProductosRepository.create.mockReturnValue(productoInvalido);
      mockProductosRepository.save.mockRejectedValue(
        new Error('Stock no válido'),
      );

      await expect(
        service.crear(productoInvalido, 1, 'admin'),
      ).rejects.toThrow('Stock no válido');
    });

    it('debería permitir a cualquier rol obtener productos activos', async () => {
      mockProductosRepository.find.mockResolvedValue([mockProducto]);

      const resultado = await service.obtener();

      expect(resultado).toEqual([mockProducto]);
      expect(mockProductosRepository.find).toHaveBeenCalledWith({
        where: { estado: 'activo' },
      });
    });
  });
});
