import { IsString, IsNumber, IsEnum, IsOptional, MinLength, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  descripcion: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  precio: number;

  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @IsEnum(['hombres', 'mujeres', 'niños', 'accesorios'], {
    message: 'La categoría debe ser: hombres, mujeres, niños o accesorios',
  })
  categoria: string;

  @IsOptional()
  @IsString()
  imagen?: string;
}

export class UpdateProductoDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  precio?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsEnum(['hombres', 'mujeres', 'niños', 'accesorios'])
  categoria?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsEnum(['activo', 'inactivo'])
  estado?: string;
}
