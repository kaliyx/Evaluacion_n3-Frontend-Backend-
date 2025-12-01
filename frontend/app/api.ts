import API_BASE, { authHeaders } from './config';
import type { Producto, ProductoPayload, ApiError } from './types';

async function handleRes<T = unknown>(res: Response): Promise<T | string> {
  const text = await res.text();
  try { return JSON.parse(text) as T; } catch { return text; }
}

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const up = await fetch(`${API_BASE}/productos/upload`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form,
  });
  const upData = await handleRes<{ url?: string } & ApiError>(up);
  if (!up.ok) {
    const msg = typeof upData === 'string' ? upData : (upData?.message || up.statusText);
    throw new Error(`Error uploading image: ${msg}`);
  }
  return (typeof upData === 'string' ? upData : upData.url) || '';
}

export async function getProductos(): Promise<Producto[]> { 
  const res = await fetch(`${API_BASE}/productos`, { headers: { ...authHeaders() } }); 
  const data = await handleRes<Producto[] & ApiError>(res);
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data?.message || JSON.stringify(data)));
  return data as Producto[];
}

export async function crearProducto(payload: ProductoPayload): Promise<Producto> {
  let imagenUrl = payload.imagen || '';
  if (payload.imageFile) {
    imagenUrl = await uploadImage(payload.imageFile);
  }

  if (!imagenUrl) imagenUrl = '/assets/imagenes/null.jpg';

  const bodyPayload: Omit<ProductoPayload, 'imageFile'> & { imagen: string } = {
    ...payload,
    imagen: imagenUrl,
  };
  delete (bodyPayload as any).imageFile;

  const res = await fetch(`${API_BASE}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(bodyPayload),
  });
  const data = await handleRes<Producto & ApiError>(res);
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data?.message || JSON.stringify(data)));
  return data as Producto;
}

export async function actualizarProducto(id: number, payload: ProductoPayload): Promise<Producto> {
  let imagenUrl = payload.imagen || '';
  if (payload.imageFile) {
    imagenUrl = await uploadImage(payload.imageFile);
  }

  if (!imagenUrl) imagenUrl = '/assets/imagenes/null.jpg';

  const bodyPayload: Omit<ProductoPayload, 'imageFile'> & { imagen: string } = {
    ...payload,
    imagen: imagenUrl,
  };
  delete (bodyPayload as any).imageFile;

  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(bodyPayload),
  });
  const data = await handleRes<Producto & ApiError>(res);
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data?.message || JSON.stringify(data)));
  return data as Producto;
}

export async function eliminarProducto(id: number) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  const data = await handleRes<ApiError>(res);
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data?.message || JSON.stringify(data)));
  return data;
}

export default {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
