# Backend Tienda de Ropa - NestJS con MySQL

Este es un backend desarrollado con **NestJS** y **MySQL** (XAMPP) para una tienda de ropa con roles de administrador y vendedor.

## Requisitos

- Node.js v16+
- XAMPP con MySQL activado
- npm o yarn

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Asegurar que XAMPP está corriendo:**
   - Abre XAMPP Control Panel
   - Inicia el servidor MySQL
   - Las tablas se crearán automáticamente al iniciar la aplicación

3. **Configurar variables de entorno:**
   - El archivo `.env` ya está configurado para XAMPP
   - Si tu configuración de MySQL es diferente, actualiza los valores en `.env`

## Configuración de Variables de Entorno

```env
PORT=3000
DB_HOST=localhost        # Host de MySQL
DB_PORT=3306            # Puerto de MySQL
DB_USER=root            # Usuario de MySQL
DB_PASSWORD=            # Contraseña de MySQL (vacío por defecto en XAMPP)
DB_NAME=tienda_ropa     # Nombre de la base de datos
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
NODE_ENV=development
```

## Ejecutar la Aplicación

### Modo de desarrollo con hot-reload:
```bash
npm run dev
```

### Modo producción:
```bash
npm run build
npm start
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── auth/              # Módulo de autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.dto.ts
│   │   └── auth.module.ts
│   ├── productos/         # Módulo de productos
│   │   ├── producto.entity.ts
│   │   ├── productos.controller.ts
│   │   ├── productos.service.ts
│   │   ├── producto-seed.service.ts
│   │   ├── dto/
│   │   │   └── producto.dto.ts
│   │   └── productos.module.ts
│   ├── usuarios/          # Módulo de usuarios
│   │   ├── usuario.entity.ts
│   │   └── usuarios.module.ts
│   ├── database/          # Configuración de base de datos
│   │   ├── database.config.ts
│   │   └── seed.service.ts
│   ├── app.module.ts      # Módulo raíz
│   └── main.ts            # Archivo de entrada
├── .env                   # Variables de entorno
├── tsconfig.json          # Configuración de TypeScript
├── nest-cli.json          # Configuración de NestJS
├── jest.config.cjs        # Configuración de Jest
└── package.json           # Dependencias y scripts
```

## Entidades de Base de Datos

### Tabla: usuarios
- `id` - ID único (AUTO_INCREMENT)
- `nombre` - Nombre del usuario
- `email` - Email único
- `password` - Contraseña encriptada con bcrypt
- `rol` - ENUM: 'admin' o 'vendedor'
- `activo` - Boolean (default: true)
- `telefono` - Teléfono opcional
- `direccion` - Dirección opcional
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

### Tabla: productos
- `id` - ID único (AUTO_INCREMENT)
- `nombre` - Nombre del producto
- `descripcion` - Descripción del producto
- `precio` - Precio en decimal (10,2)
- `stock` - Cantidad en stock
- `categoria` - ENUM: 'hombres', 'mujeres', 'niños', 'accesorios'
- `imagen` - URL o ruta de imagen
- `estado` - ENUM: 'activo' o 'inactivo'
- `vendedor_id` - FK a usuarios
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

## API Endpoints

### Autenticación

**POST /api/auth/registro**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "1234567890",
  "direccion": "Calle Principal 123"
}
```

**POST /api/auth/login**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Productos

**GET /api/productos** - Obtener todos los productos

**GET /api/productos/:id** - Obtener un producto específico

**POST /api/productos** - Crear un nuevo producto
```json
{
  "nombre": "Camiseta",
  "descripcion": "Camiseta de algodón",
  "precio": 29.99,
  "stock": 50,
  "categoria": "hombres",
  "imagen": "https://..."
}
```

**PUT /api/productos/:id** - Actualizar un producto

**DELETE /api/productos/:id** - Eliminar un producto

## Usuario Admin por Defecto

La aplicación crea automáticamente un usuario admin al iniciar:
- **Email:** admin@tienda.com
- **Contraseña:** admin123

## Notas Importantes

1. **TypeORM Synchronize:** Está habilitado en modo desarrollo, por lo que las tablas se crearán automáticamente desde las entidades.

2. **CORS:** Está habilitado para aceptar requests desde cualquier origen.

3. **JWT:** Los tokens tienen una expiración de 7 días.

4. **Bcrypt:** Las contraseñas se encriptan con bcrypt antes de guardarse.

## Solución de Problemas

### Error: "connect ECONNREFUSED 127.0.0.1:3306"
- Asegúrate de que XAMPP está ejecutando MySQL
- Verifica que los datos de conexión en `.env` son correctos

### Error: "database doesn't exist"
- Ejecuta el script SQL en phpMyAdmin
- O usa la opción `synchronize: true` en database.config.ts

### Puerto 3000 en uso
- Cambia el puerto en `.env` a otro disponible

## Comandos Útiles

```bash
# Instalar una nueva dependencia
npm install nombre-paquete

# Crear un nuevo módulo
nest g module nombre-modulo

# Crear un nuevo controlador
nest g controller nombre-controlador

# Crear un nuevo servicio
nest g service nombre-servicio

# Compilar el proyecto
npm run build

# Ejecutar en modo watch
npm run dev
```

## Licencia

MIT
