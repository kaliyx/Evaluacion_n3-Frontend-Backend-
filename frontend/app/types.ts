export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string | null;
  estado?: string;
  vendedor_id?: number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ProductoPayload {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen?: string | null;
  imageFile?: File;
}

export interface ApiError {
  message?: string;
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}
