import React, { memo, useCallback } from 'react';
import { Card, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Boton from '../atoms/Boton';
import { styles } from '../../assets/styles';

const { Meta } = Card;
const { Text } = Typography;

const TarjetaProducto = memo(({ producto, alAgregar }) => {
  const handleAgregar = useCallback(() => {
    if (typeof alAgregar === 'function') alAgregar(producto);
  }, [alAgregar, producto]);

  return (
    <Card
      hoverable
      style={styles.tarjetaProducto}
      cover={
        producto.imagen ? (
          <img
            alt={producto.nombre}
            src={producto.imagen}
            style={styles.imagenProducto}
            loading="lazy"
          />
        ) : null
      }
      actions={[
        <Boton
          key="add"
          texto="Agregar"
          icono={<ShoppingCartOutlined />}
          onClick={handleAgregar}
        />
      ]}
    >
      <Meta title={producto.nombre} description={`ID: ${producto.id}`} />
      <div style={{ marginTop: 10 }}>
        <Text strong style={styles.productoPrecio}>${producto.precio}</Text>
      </div>
    </Card>
  );
});

export default TarjetaProducto;
