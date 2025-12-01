import React from 'react';
import { Card, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Boton from '../atoms/Boton';

const { Meta } = Card;
const { Text } = Typography;

const TarjetaProducto = ({ producto, alAgregar }) => (
  <Card
    hoverable
    style={{ width: 240, margin: '10px' }}
    cover={
      <img 
        alt={producto.nombre} 
        src={producto.imagen} 
        style={{ height: 200, objectFit: 'cover' }} 
      />
    }
    actions={[
      <Boton 
        key="add" 
        texto="Agregar" 
        icono={<ShoppingCartOutlined />} 
        onClick={() => alAgregar(producto)} 
      />
    ]}
  >
    <Meta title={producto.nombre} description={`ID: ${producto.id}`} />
    <div style={{ marginTop: 10 }}>
      <Text strong style={{ fontSize: 16 }}>${producto.precio}</Text>
    </div>
  </Card>
);

export default TarjetaProducto;
