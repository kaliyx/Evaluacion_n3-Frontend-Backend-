import React from 'react';
import { Card, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Boton from '../atoms/Boton';
import { styles } from '../../assets/styles';

const { Meta } = Card;
const { Text } = Typography;

const TarjetaProducto = ({ producto, alAgregar }) => (
  <Card hoverable style={styles.tarjetaProducto} cover={<img alt={producto.nombre} src={producto.imagen} style={styles.imagenProducto} />}
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
      <Text strong style={styles.productoPrecio}>${producto.precio}</Text>
    </div>
  </Card>
);

export default TarjetaProducto;
