import React, { useState } from 'react';
import { Row, Col, message } from 'antd';
import { useNavigate } from 'react-router';

// Imports de componentes
import LayoutPrincipal from '../../components/layouts/LayoutPrincipal';
import BarraBusqueda from '../../components/molecules/BarraBusqueda';
import TarjetaProducto from '../../components/molecules/TarjetaProducto';
import PanelVendedor from '../../components/organisms/PanelVendedor';

// Datos Mock
const PRODUCTOS_MOCK = [
  { id: 1, nombre: 'Polera Oversize', precio: 15000, imagen: '/assets/imagenes/polera.png' },
  { id: 2, nombre: 'Jeans Cargo', precio: 25000, imagen: '/assets/imagenes/jeans.png' },
  { id: 3, nombre: 'Hoddie Negro', precio: 30000, imagen: '/assets/imagenes/hoddie.png' },
];

export default function Vendedor() {
  const [productos, setProductos] = useState(PRODUCTOS_MOCK);
  const [carrito, setCarrito] = useState<any[]>([]);
  const navigate = useNavigate();

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