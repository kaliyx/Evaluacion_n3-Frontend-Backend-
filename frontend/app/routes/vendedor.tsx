import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import { useNavigate } from 'react-router';

// Imports de componentes
import LayoutPrincipal from '../../components/layouts/LayoutPrincipal';
import BarraBusqueda from '../../components/molecules/BarraBusqueda';
import TarjetaProducto from '../../components/molecules/TarjetaProducto';
import PanelVendedor from '../../components/organisms/PanelVendedor';
import API_BASE from '../config';

// Datos Mock (fallback)
const PRODUCTOS_MOCK = [
  { id: 1, nombre: 'Polera Oversize', precio: 15000, imagen: '/assets/imagenes/polera.png' },
  { id: 2, nombre: 'Jeans Cargo', precio: 25000, imagen: '/assets/imagenes/jeans.png' },
  { id: 3, nombre: 'Hoddie Negro', precio: 30000, imagen: '/assets/imagenes/hoddie.png' },
];

export default function Vendedor() {
  const [productos, setProductos] = useState(PRODUCTOS_MOCK);
  const [carrito, setCarrito] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/productos`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener productos');
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        // Map backend fields to frontend display-friendly shape
        const mapped = Array.isArray(data)
          ? data.map((p: any) => ({
              id: p.id,
              nombre: p.nombre,
              precio: Number(p.precio),
              imagen: p.imagen || '/assets/imagenes/polera.png',
            }))
          : PRODUCTOS_MOCK;
        setProductos(mapped);
      })
      .catch((err) => {
        console.warn('Fetch productos failed, usando mock', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const manejarBusqueda = (valor: string) => {
    const filtrados = PRODUCTOS_MOCK.filter(p => 
      p.nombre.toLowerCase().includes(valor.toLowerCase()) || 
      p.id.toString().includes(valor)
    );
    setProductos(filtrados);
  };

  const agregarAlCarrito = (producto: any) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    message.success(`${producto.nombre} agregado`);
  };

  const eliminarDelCarrito = (id: any) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const calcularTotal = () => carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const irAPago = () => {
    if (carrito.length === 0) {
      message.error("El carrito está vacío");
      return;
    }
    // Navegación con estado
    navigate('/pago', { state: { carrito, total: calcularTotal() } });
  };

  return (
    <LayoutPrincipal rol="vendedor">
      <Row gutter={16}>
        <Col span={16}>
          <div style={{ marginBottom: 20 }}>
            <BarraBusqueda onSearch={manejarBusqueda} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {productos.map(prod => (
              <TarjetaProducto key={prod.id} producto={prod} alAgregar={agregarAlCarrito} />
            ))}
          </div>
        </Col>
        <Col span={8}>
          <PanelVendedor 
            carrito={carrito} 
            total={calcularTotal()} 
            alEliminarItem={eliminarDelCarrito} 
            alPagar={irAPago} 
          />
        </Col>
      </Row>
    </LayoutPrincipal>
  );
}