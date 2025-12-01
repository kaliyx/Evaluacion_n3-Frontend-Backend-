import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoSeedService } from './producto-seed.service';
import { Producto } from './producto.entity';

describe('ProductoSeedService', () => {
  let service: ProductoSeedService;
  let mockProductosRepository: any;

  beforeEach(async () => {
    mockProductosRepository = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoSeedService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockProductosRepository,
        },
      ],
    }).compile();

    service = module.get<ProductoSeedService>(ProductoSeedService);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('seed', () => {
    it('debería omitir seed si ya existen productos', async () => {
      mockProductosRepository.count.mockResolvedValue(5); // Ya hay productos

      await service.seed();

      expect(mockProductosRepository.create).not.toHaveBeenCalled();
      expect(mockProductosRepository.save).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        'Productos ya existen. Seed de productos omitido.',
      );
    });

    it('debería crear 8 productos', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Producto Test',
        precio: 29.99,
        stock: 50,
      });
      mockProductosRepository.save.mockResolvedValue({
        id: 1,
        nombre: 'Producto Test',
      });

      await service.seed();

      expect(mockProductosRepository.create).toHaveBeenCalledTimes(8);
      expect(mockProductosRepository.save).toHaveBeenCalledTimes(8);
    });

    it('debería crear productos con campos requeridos', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Test',
        descripcion: 'Test desc',
        precio: 29.99,
        stock: 50,
        categoria: 'test',
        estado: 'activo',
        vendedor_id: 1,
      });
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      const allCalls = mockProductosRepository.create.mock.calls;
      for (const call of allCalls) {
        expect(call[0]).toHaveProperty('nombre');
        expect(call[0]).toHaveProperty('descripcion');
        expect(call[0]).toHaveProperty('precio');
        expect(call[0]).toHaveProperty('stock');
        expect(call[0]).toHaveProperty('categoria');
        expect(call[0]).toHaveProperty('estado');
        expect(call[0]).toHaveProperty('vendedor_id');
      }
    });

    it('debería crear productos con estado activo', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Test',
        estado: 'activo',
      });
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      const allCalls = mockProductosRepository.create.mock.calls;
      for (const call of allCalls) {
        expect(call[0].estado).toBe('activo');
      }
    });

    it('debería asignar vendedor_id a los productos', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Test',
        vendedor_id: 1,
      });
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      const allCalls = mockProductosRepository.create.mock.calls;
      for (const call of allCalls) {
        expect(call[0]).toHaveProperty('vendedor_id');
        expect([1, 2, 3]).toContain(call[0].vendedor_id);
      }
    });

    it('debería tener precios válidos para todos los productos', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Test',
        precio: 29.99,
      });
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      const allCalls = mockProductosRepository.create.mock.calls;
      for (const call of allCalls) {
        expect(call[0].precio).toBeGreaterThan(0);
        expect(typeof call[0].precio).toBe('number');
      }
    });

    it('debería tener stock válido para todos los productos', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Test',
        stock: 50,
      });
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      const allCalls = mockProductosRepository.create.mock.calls;
      for (const call of allCalls) {
        expect(call[0].stock).toBeGreaterThanOrEqual(0);
        expect(typeof call[0].stock).toBe('number');
      }
    });

    it('debería tener categorías válidas', async () => {
      const categoriasValidas = ['hombres', 'mujeres', 'niños', 'accesorios'];
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Test',
        categoria: 'hombres',
      });
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      const allCalls = mockProductosRepository.create.mock.calls;
      for (const call of allCalls) {
        expect(categoriasValidas).toContain(call[0].categoria);
      }
    });

    it('debería guardar todos los productos en la base de datos', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Test',
      });
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      expect(mockProductosRepository.save).toHaveBeenCalledTimes(8);
    });

    it('debería loguear cuando el seed se complete', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Test',
      });
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      expect(console.log).toHaveBeenCalledWith('Seed de productos completado.');
    });

    it('debería loguear cada producto creado', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      const mockProducto = {
        nombre: 'Producto Test',
      };
      mockProductosRepository.create.mockReturnValue(mockProducto);
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('✓ Producto creado:'),
      );
    });

    it('debería iniciar con mensaje de log', async () => {
      mockProductosRepository.count.mockResolvedValue(0);

      mockProductosRepository.create.mockReturnValue({
        nombre: 'Test',
      });
      mockProductosRepository.save.mockResolvedValue({ id: 1 });

      await service.seed();

      expect(console.log).toHaveBeenCalledWith('Iniciando seed de productos...');
    });
  });
});
