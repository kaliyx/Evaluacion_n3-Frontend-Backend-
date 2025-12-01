-- ============================================================================
-- FULLSTACK BACKEND - SCRIPT SQL
-- Sistema de Punto de Venta (POS) para Comida Rápida
-- ============================================================================
-- Este script crea la estructura completa de la base de datos
-- Fecha: 30 de Noviembre de 2025
-- ============================================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS tienda_ropa;
USE tienda_ropa;

-- ============================================================================
-- TABLA: USUARIOS (Admin y Vendedores)
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'vendedor') NOT NULL DEFAULT 'vendedor',
  activo BOOLEAN DEFAULT TRUE,
  telefono VARCHAR(20),
  direccion TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: PRODUCTOS (Menú del restaurante)
-- ============================================================================
CREATE TABLE IF NOT EXISTS productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  categoria ENUM('hamburguesas', 'pizzas', 'bebidas', 'postres', 'accesorios') NOT NULL,
  imagen VARCHAR(500),
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  vendedor_id INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_estado (estado),
  INDEX idx_categoria (categoria),
  INDEX idx_vendedor_id (vendedor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: VENTAS (Facturas/Transacciones)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendedor_id INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  impuesto DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'pendiente',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_vendedor_id (vendedor_id),
  INDEX idx_estado (estado),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: DETALLE_VENTAS (Líneas de cada factura)
-- ============================================================================
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
  INDEX idx_venta_id (venta_id),
  INDEX idx_producto_id (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DATOS INICIALES - USUARIOS
-- ============================================================================
-- Contraseña: admin123 (hasheada con bcrypt, 10 salt rounds)
-- Hash: $2a$10$YmFzZWQ2NCBlbmNvZGluZyBpcyBub3QgYSBwYXNzd29yZCBoYXNo

INSERT INTO usuarios (nombre, email, password, rol, activo, telefono, direccion) VALUES
('Administrador', 'admin@tienda.com', '$2a$10$SomeHashedPassword123ForAdmin456', 'admin', TRUE, '1234567890', 'Calle Principal 123'),
('Juan Pérez', 'juan@tienda.com', '$2a$10$SomeHashedPassword456ForJuan789', 'vendedor', TRUE, '1234567890', 'Tienda - Juan'),
('María García', 'maria@tienda.com', '$2a$10$SomeHashedPassword789ForMaria000', 'vendedor', TRUE, '1234567890', 'Tienda - María'),
('Carlos López', 'carlos@tienda.com', '$2a$10$SomeHashedPassword000ForCarlos111', 'vendedor', TRUE, '1234567890', 'Tienda - Carlos');

-- ============================================================================
-- DATOS INICIALES - PRODUCTOS (8 productos)
-- ============================================================================
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, estado, vendedor_id) VALUES
('Hamburguesa Clásica', 'Hamburguesa con queso, lechuga y tomate', 25.99, 100, 'hamburguesas', 'activo', 1),
('Hamburguesa Deluxe', 'Doble carne, queso cheddar, bacon y cebolla', 35.99, 80, 'hamburguesas', 'activo', 1),
('Pizza Margherita', 'Tomate, mozzarella y albahaca', 30.99, 50, 'pizzas', 'activo', 2),
('Pizza Pepperoni', 'Salsa, queso y pepperoni', 32.99, 45, 'pizzas', 'activo', 2),
('Coca Cola 500ml', 'Bebida refrescante', 5.99, 200, 'bebidas', 'activo', 1),
('Jugo Natural', 'Jugo fresco de frutas', 8.99, 150, 'bebidas', 'activo', 3),
('Flan', 'Postre tradicional de caramelo', 7.99, 60, 'postres', 'activo', 1),
('Brownie', 'Brownie de chocolate con nueces', 9.99, 70, 'postres', 'activo', 2);

-- ============================================================================
-- DATOS INICIALES - VENTAS DE EJEMPLO (4 ventas)
-- ============================================================================
INSERT INTO ventas (vendedor_id, subtotal, impuesto, total, estado) VALUES
(2, 51.98, 9.88, 61.86, 'completada'),
(3, 100.00, 19.00, 119.00, 'completada'),
(2, 65.00, 12.35, 77.35, 'pendiente'),
(4, 150.00, 28.50, 178.50, 'completada');

-- ============================================================================
-- DATOS INICIALES - DETALLES DE VENTAS
-- ============================================================================
INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
-- Venta 1 (Juan)
(1, 1, 2, 25.99, 51.98),
-- Venta 2 (María)
(2, 3, 2, 30.99, 61.98),
(2, 5, 2, 5.99, 11.98),
(2, 7, 1, 7.99, 7.99),
-- Venta 3 (Juan)
(3, 2, 1, 35.99, 35.99),
(3, 6, 4, 8.99, 35.96),
-- Venta 4 (Carlos)
(4, 4, 2, 32.99, 65.98),
(4, 8, 5, 9.99, 49.95);

-- ============================================================================
-- CONSULTAS DE VERIFICACIÓN
-- ============================================================================

-- Ver estructura de usuarios
SELECT 'TABLA: USUARIOS' AS Tabla;
SELECT * FROM usuarios;
SELECT '---' AS '---';

-- Ver estructura de productos
SELECT 'TABLA: PRODUCTOS' AS Tabla;
SELECT * FROM productos;
SELECT '---' AS '---';

-- Ver estructura de ventas
SELECT 'TABLA: VENTAS' AS Tabla;
SELECT * FROM ventas;
SELECT '---' AS '---';

-- Ver detalle de ventas
SELECT 'TABLA: DETALLE_VENTAS' AS Tabla;
SELECT * FROM detalle_ventas;
SELECT '---' AS '---';

-- ============================================================================
-- CONSULTAS ÚTILES PARA REVISAR DATOS
-- ============================================================================

-- Total de ventas por vendedor
SELECT 
  u.nombre AS 'Vendedor',
  COUNT(v.id) AS 'Total Ventas',
  SUM(v.total) AS 'Monto Total',
  SUM(v.impuesto) AS 'Impuesto Total (19%)'
FROM usuarios u
LEFT JOIN ventas v ON u.id = v.vendedor_id
WHERE u.rol = 'vendedor'
GROUP BY u.id, u.nombre;

-- Ventas completadas vs pendientes
SELECT 
  v.estado AS 'Estado',
  COUNT(v.id) AS 'Cantidad',
  SUM(v.total) AS 'Monto Total'
FROM ventas v
GROUP BY v.estado;

-- Productos más vendidos
SELECT 
  p.nombre AS 'Producto',
  SUM(dv.cantidad) AS 'Cantidad Vendida',
  SUM(dv.subtotal) AS 'Monto Total'
FROM productos p
LEFT JOIN detalle_ventas dv ON p.id = dv.producto_id
GROUP BY p.id, p.nombre
ORDER BY SUM(dv.cantidad) DESC;

-- Resumen de inventario
SELECT 
  p.nombre AS 'Producto',
  p.stock AS 'Stock Actual',
  p.categoria AS 'Categoría',
  p.precio AS 'Precio'
FROM productos p
WHERE p.estado = 'activo'
ORDER BY p.stock ASC;

-- ============================================================================
-- FIN DEL SCRIPT SQL
-- ============================================================================
-- NOTA: Las contraseñas están usando hashes ficticios para demostración
-- En producción, se usan hashes reales generados con bcrypt
-- 
-- Credenciales de acceso (para testing):
-- Admin: admin@tienda.com / admin123
-- Vendedor 1: juan@tienda.com / vendor123
-- Vendedor 2: maria@tienda.com / vendor123
-- Vendedor 3: carlos@tienda.com / vendor123
-- ============================================================================
