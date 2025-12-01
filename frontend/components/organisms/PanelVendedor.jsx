import React from 'react';
import { List, Typography, Divider } from 'antd';
import { DeleteOutlined, DollarCircleOutlined } from '@ant-design/icons';
import Boton from '../atoms/Boton';
import { styles } from '../../assets/styles';

const { Title } = Typography;

const PanelVendedor = ({ carrito, total, alEliminarItem, alPagar }) => (
  <div style={styles.panelVendedor}>
    <Title level={4}>Productos Agregados</Title>
    <Divider />
    
    <List
      itemLayout="horizontal"
      dataSource={carrito}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <div style={styles.flexBetweenMargin}>
            <div>
              <div>{item.nombre}</div>
              <div>{`${item.cantidad} un. x $${item.precio}`}</div>
            </div>
            <div style={styles.flexBetweenMargin}>
              <div><strong>${item.cantidad * item.precio}</strong></div>
              <Boton
                icono={<DeleteOutlined />}
                peligro={true}
                tipo="text"
                onClick={() => alEliminarItem(item.id)}
              />
            </div>
          </div>
        </List.Item>
      )}
    />
    
    <Divider />
    <div style={styles.flexBetweenMargin}>
      <Title level={3}>Total:</Title>
      <Title level={3}>${total}</Title>
    </div>
    
    <Boton
      texto="Realizar Pago"
      tipo="primary"
      onClick={alPagar}
      icono={<DollarCircleOutlined />}
      style={styles.botonGrande}
      block={true}
    />
  </div>
);

export default PanelVendedor;
