import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { Venta } from './venta.entity';
import { Producto } from '../productos/producto.entity';
import { BadRequestException } from '@nestjs/common';

describe('VentasService', () => {
  let service: VentasService;
  let mockVentasRepository: any;
  let mockProductosRepository: any;

  const mockProducto = {
    id: 1,
    nombre: 'Hamburguesa',
    descripcion: 'Hamburguesa clásica',
    precio: 15.99,
    stock: 100,
    categoria: 'comida',
    imagen: 'https://example.com/hamburguesa.jpg',
    estado: 'activo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVenta = {
    id: 1,
    vendedor_id: 1,
    subtotal: 15.99,
    impuesto: 3.04,
    total: 19.03,
    estado: 'pendiente',
    detalles: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockVentasRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockProductosRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VentasService,
        {
          provide: getRepositoryToken(Venta),
          useValue: mockVentasRepository,
        },
        {
          provide: getRepositoryToken(Producto),
          useValue: mockProductosRepository,
        },
      ],
    }).compile();

    service = module.get<VentasService>(VentasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearVenta', () => {
    it('debería crear una venta correctamente', async () => {
      const createVentaDto = {
        items: [{ producto_id: 1, cantidad: 2 }],
      };

      mockProductosRepository.findOne.mockResolvedValue(mockProducto);
      mockProductosRepository.save.mockResolvedValue({ ...mockProducto, stock: 98 });

      const expectedSubtotal = 15.99 * 2;
      const expectedImpuesto = expectedSubtotal * 0.19;
      const expectedTotal = expectedSubtotal + expectedImpuesto;

      mockVentasRepository.save.mockResolvedValue({
        ...mockVenta,
        id: 1,
        subtotal: expectedSubtotal,
        impuesto: expectedImpuesto,
        total: expectedTotal,
      });

      const resultado = await service.crearVenta(createVentaDto, 1);

      expect(resultado.vendedor_id).toBe(1);
      expect(resultado.estado).toBe('pendiente');
      expect(resultado.subtotal).toBe(expectedSubtotal);
      expect(resultado.impuesto).toBeCloseTo(expectedImpuesto, 2);
      expect(mockVentasRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si producto no existe', async () => {
      const createVentaDto = {
        items: [{ producto_id: 999, cantidad: 1 }],
      };

      mockProductosRepository.findOne.mockResolvedValue(null);

      await expect(
        service.crearVenta(createVentaDto, 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar BadRequestException si stock es insuficiente', async () => {
      const createVentaDto = {
        items: [{ producto_id: 1, cantidad: 150 }],
      };

      mockProductosRepository.findOne.mockResolvedValue(mockProducto); // stock: 100

      await expect(
        service.crearVenta(createVentaDto, 1),
      ).rejects.toThrow('Stock insuficiente para Hamburguesa');
    });

    it('debería descontar stock correctamente', async () => {
      const createVentaDto = {
        items: [{ producto_id: 1, cantidad: 5 }],
      };

      mockProductosRepository.findOne.mockResolvedValue({ ...mockProducto, stock: 100 });
      mockVentasRepository.save.mockResolvedValue(mockVenta);

      await service.crearVenta(createVentaDto, 1);

      expect(mockProductosRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          stock: 95, // 100 - 5
        }),
      );
    });

    it('debería calcular IVA al 19%', async () => {
      const createVentaDto = {
        items: [{ producto_id: 1, cantidad: 1 }],
      };

      mockProductosRepository.findOne.mockResolvedValue(mockProducto);
      mockVentasRepository.save.mockResolvedValue({
        ...mockVenta,
        subtotal: 15.99,
        impuesto: 15.99 * 0.19,
        total: 15.99 + 15.99 * 0.19,
      });

      const resultado = await service.crearVenta(createVentaDto, 1);

      expect(resultado.impuesto).toBeCloseTo(15.99 * 0.19, 2);
      expect(resultado.total).toBeCloseTo(15.99 * 1.19, 2);
    });

    it('debería crear venta con múltiples items', async () => {
      const createVentaDto = {
        items: [
          { producto_id: 1, cantidad: 2 },
          { producto_id: 1, cantidad: 1 },
        ],
      };

      mockProductosRepository.findOne.mockResolvedValue(mockProducto);
      mockVentasRepository.save.mockResolvedValue(mockVenta);

      const resultado = await service.crearVenta(createVentaDto, 1);

      expect(resultado.estado).toBe('pendiente');
      expect(mockProductosRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockProductosRepository.save).toHaveBeenCalledTimes(2);
    });

    it('debería asignar vendedor_id correctamente', async () => {
      const createVentaDto = {
        items: [{ producto_id: 1, cantidad: 1 }],
      };

      mockProductosRepository.findOne.mockResolvedValue(mockProducto);
      mockVentasRepository.save.mockResolvedValue({ ...mockVenta, vendedor_id: 5 });

      const resultado = await service.crearVenta(createVentaDto, 5);

      expect(resultado.vendedor_id).toBe(5);
    });
  });

  describe('completarVenta', () => {
    it('debería completar una venta correctamente', async () => {
      const ventaCompleta = { ...mockVenta, estado: 'completada' };

      mockVentasRepository.findOne.mockResolvedValue(mockVenta);
      mockVentasRepository.save.mockResolvedValue(ventaCompleta);

      const resultado = await service.completarVenta(1, 1);

      expect(resultado.estado).toBe('completada');
      expect(mockVentasRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si venta no existe', async () => {
      mockVentasRepository.findOne.mockResolvedValue(null);

      await expect(
        service.completarVenta(999, 1),
      ).rejects.toThrow('Venta no encontrada');
    });

    it('debería lanzar ForbiddenException si vendedor no es propietario', async () => {
      mockVentasRepository.findOne.mockResolvedValue({
        ...mockVenta,
        vendedor_id: 1,
      });

      await expect(
        service.completarVenta(1, 2), // Usuario 2 intenta completar venta de usuario 1
      ).rejects.toThrow('No tienes permiso para completar esta venta');
    });

    it('debería validar que el vendedor sea el propietario de la venta', async () => {
      mockVentasRepository.findOne.mockResolvedValue(mockVenta);
      mockVentasRepository.save.mockResolvedValue(mockVenta);

      await service.completarVenta(1, 1);

      expect(mockVentasRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['detalles'],
      });
    });
  });

  describe('cancelarVenta', () => {
    it('debería cancelar una venta correctamente', async () => {
      const detalleVenta = {
        id: 1,
        producto_id: 1,
        cantidad: 2,
        precio_unitario: 15.99,
        subtotal: 31.98,
      };

      const ventaConDetalles = {
        ...mockVenta,
        detalles: [detalleVenta],
      };

      mockVentasRepository.findOne.mockResolvedValue(ventaConDetalles);
      mockProductosRepository.findOne.mockResolvedValue({ ...mockProducto, stock: 98 });
      mockVentasRepository.save.mockResolvedValue({
        ...ventaConDetalles,
        estado: 'cancelada',
      });

      const resultado = await service.cancelarVenta(1, 1);

      expect(resultado.estado).toBe('cancelada');
      expect(mockVentasRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si venta no existe', async () => {
      mockVentasRepository.findOne.mockResolvedValue(null);

      await expect(
        service.cancelarVenta(999, 1),
      ).rejects.toThrow('Venta no encontrada');
    });

    it('debería lanzar ForbiddenException si vendedor no es propietario', async () => {
      mockVentasRepository.findOne.mockResolvedValue({
        ...mockVenta,
        vendedor_id: 1,
        detalles: [],
      });

      await expect(
        service.cancelarVenta(1, 2),
      ).rejects.toThrow('No tienes permiso para cancelar esta venta');
    });

    it('debería retornar stock al cancelar', async () => {
      const detalleVenta = {
        id: 1,
        producto_id: 1,
        cantidad: 5,
        precio_unitario: 15.99,
        subtotal: 79.95,
      };

      const ventaConDetalles = {
        ...mockVenta,
        detalles: [detalleVenta],
      };

      mockVentasRepository.findOne.mockResolvedValue(ventaConDetalles);
      mockProductosRepository.findOne.mockResolvedValue({ ...mockProducto, stock: 95 });
      mockVentasRepository.save.mockResolvedValue({
        ...ventaConDetalles,
        estado: 'cancelada',
      });

      await service.cancelarVenta(1, 1);

      expect(mockProductosRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          stock: 100, // 95 + 5
        }),
      );
    });

    it('debería manejar múltiples detalles al cancelar', async () => {
      const detalles = [
        { id: 1, producto_id: 1, cantidad: 2, precio_unitario: 15.99, subtotal: 31.98 },
        { id: 2, producto_id: 1, cantidad: 3, precio_unitario: 15.99, subtotal: 47.97 },
      ];

      const ventaConDetalles = {
        ...mockVenta,
        detalles,
      };

      mockVentasRepository.findOne.mockResolvedValue(ventaConDetalles);
      mockProductosRepository.findOne.mockResolvedValue(mockProducto);
      mockVentasRepository.save.mockResolvedValue({
        ...ventaConDetalles,
        estado: 'cancelada',
      });

      await service.cancelarVenta(1, 1);

      expect(mockProductosRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockProductosRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('obtenerVentasAdmin', () => {
    it('debería obtener todas las ventas', async () => {
      const ventas = [mockVenta, { ...mockVenta, id: 2, vendedor_id: 2 }];

      mockVentasRepository.find.mockResolvedValue(ventas);

      const resultado = await service.obtenerVentasAdmin();

      expect(resultado).toEqual(ventas);
      expect(mockVentasRepository.find).toHaveBeenCalledWith({
        relations: ['detalles', 'detalles.producto'],
        order: { createdAt: 'DESC' },
      });
    });

    it('debería retornar array vacío si no hay ventas', async () => {
      mockVentasRepository.find.mockResolvedValue([]);

      const resultado = await service.obtenerVentasAdmin();

      expect(resultado).toEqual([]);
    });

    it('debería incluir relaciones de detalles y productos', async () => {
      mockVentasRepository.find.mockResolvedValue([mockVenta]);

      await service.obtenerVentasAdmin();

      expect(mockVentasRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: ['detalles', 'detalles.producto'],
        }),
      );
    });
  });

  describe('obtenerVentasVendedor', () => {
    it('debería obtener ventas del vendedor específico', async () => {
      const ventasVendedor = [mockVenta];

      mockVentasRepository.find.mockResolvedValue(ventasVendedor);

      const resultado = await service.obtenerVentasVendedor(1);

      expect(resultado).toEqual(ventasVendedor);
      expect(mockVentasRepository.find).toHaveBeenCalledWith({
        where: { vendedor_id: 1 },
        relations: ['detalles', 'detalles.producto'],
        order: { createdAt: 'DESC' },
      });
    });

    it('debería retornar solo ventas del vendedor indicado', async () => {
      mockVentasRepository.find.mockResolvedValue([]);

      await service.obtenerVentasVendedor(5);

      expect(mockVentasRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { vendedor_id: 5 },
        }),
      );
    });

    it('debería retornar array vacío si vendedor no tiene ventas', async () => {
      mockVentasRepository.find.mockResolvedValue([]);

      const resultado = await service.obtenerVentasVendedor(1);

      expect(resultado).toEqual([]);
    });
  });

  describe('obtenerVentasPorFecha', () => {
    it('debería obtener ventas completadas de una fecha específica', async () => {
      const ventas = [mockVenta];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ventas),
      };

      mockVentasRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const resultado = await service.obtenerVentasPorFecha('2025-11-30');

      expect(resultado).toEqual(ventas);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('debería filtrar solo ventas completadas', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockVentasRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.obtenerVentasPorFecha('2025-11-30');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'venta.estado = :estado',
        { estado: 'completada' },
      );
    });

    it('debería retornar array vacío si no hay ventas en la fecha', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockVentasRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const resultado = await service.obtenerVentasPorFecha('2025-01-01');

      expect(resultado).toEqual([]);
    });
  });

  describe('obtenerResumenVentas', () => {
    it('debería calcular resumen de ventas correctamente', async () => {
      const ventas = [
        { ...mockVenta, total: 19.03, impuesto: 3.04, vendedor_id: 1 },
        { ...mockVenta, id: 2, total: 19.03, impuesto: 3.04, vendedor_id: 2 },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ventas),
      };

      mockVentasRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const resultado = await service.obtenerResumenVentas('2025-11-30');

      expect(resultado.fecha).toBe('2025-11-30');
      expect(resultado.cantidadVentas).toBe(2);
      expect(resultado.totalVentas).toBeCloseTo(38.06, 2);
      expect(resultado.totalImpuesto).toBeCloseTo(6.08, 2);
    });

    it('debería agrupar ventas por vendedor', async () => {
      const ventas = [
        { ...mockVenta, total: 19.03, impuesto: 3.04, vendedor_id: 1 },
        { ...mockVenta, id: 2, total: 19.03, impuesto: 3.04, vendedor_id: 1 },
        { ...mockVenta, id: 3, total: 19.03, impuesto: 3.04, vendedor_id: 2 },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ventas),
      };

      mockVentasRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const resultado = await service.obtenerResumenVentas('2025-11-30');

      expect(resultado.ventasPorVendedor).toHaveLength(2);
      expect(resultado.ventasPorVendedor[0]).toMatchObject({
        vendedor_id: 1,
        cantidad: 2,
      });
    });

    it('debería incluir detalles de ventas en el resumen', async () => {
      const ventas = [mockVenta];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ventas),
      };

      mockVentasRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const resultado = await service.obtenerResumenVentas('2025-11-30');

      expect(resultado.detalleVentas).toBeDefined();
      expect(resultado.detalleVentas).toEqual(ventas);
    });

    it('debería retornar resumen vacío si no hay ventas', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockVentasRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const resultado = await service.obtenerResumenVentas('2025-01-01');

      expect(resultado.cantidadVentas).toBe(0);
      expect(resultado.totalVentas).toBe(0);
      expect(resultado.totalImpuesto).toBe(0);
    });
  });
});
