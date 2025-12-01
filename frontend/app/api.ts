import API_BASE, { authHeaders } from './config';

async function handleRes(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function getProductos() { 
  const res = await fetch(`${API_BASE}/productos`, { headers: { ...authHeaders() } }); 
  const data = await handleRes(res);
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data?.message || JSON.stringify(data)));
  return data;
}

export async function crearProducto(payload: any) {
  // If payload contains an imageFile, upload it first
  let imagenUrl = payload.imagen || '';
  if (payload.imageFile) {
    try {
      const form = new FormData();
      form.append('file', payload.imageFile);
      const up = await fetch(`${API_BASE}/productos/upload`, {
        method: 'POST',
        headers: { ...authHeaders() },
        body: form,
      });
      if (!up.ok) throw new Error('Error uploading image'); 
      const upData = await handleRes(up); 
      imagenUrl = upData.url || imagenUrl; 
    } catch (uploadErr: any) {
      throw new Error(`Error uploading image: ${uploadErr?.message || uploadErr}`);
    }
  }

    // Si no hay imagen, usar imagen por defecto del frontend
    if (!imagenUrl) imagenUrl = '/assets/imagenes/null.jpg';

  // Build body without non-whitelisted fields (like imageFile)
  const bodyPayload: any = { ...payload };
  delete bodyPayload.imageFile;
  bodyPayload.imagen = imagenUrl;

  const res = await fetch(`${API_BASE}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(bodyPayload),
  });
  const data = await handleRes(res);
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data?.message || JSON.stringify(data)));
  return data;
}

export async function actualizarProducto(id: number, payload: any) {
  let imagenUrl = payload.imagen || '';
  if (payload.imageFile) {
    try {
      const form = new FormData();
      form.append('file', payload.imageFile);
      const up = await fetch(`${API_BASE}/productos/upload`, {
        method: 'POST',
        headers: { ...authHeaders() },
        body: form,
      });
      if (!up.ok) throw new Error('Error uploading image'); 
      const upData = await handleRes(up); 
      imagenUrl = upData.url || imagenUrl; 
    } catch (uploadErr: any) {
      throw new Error(`Error uploading image: ${uploadErr?.message || uploadErr}`);
    }
  }

    // Si no hay imagen, usar imagen por defecto del frontend
    if (!imagenUrl) imagenUrl = '/assets/imagenes/null.jpg';

  const bodyPayload: any = { ...payload };
  delete bodyPayload.imageFile;
  bodyPayload.imagen = imagenUrl;

  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(bodyPayload),
  });
  const data = await handleRes(res);
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data?.message || JSON.stringify(data)));
  return data;
}

export async function eliminarProducto(id: number) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  const data = await handleRes(res);
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data?.message || JSON.stringify(data)));
  return data;
}

export default {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
