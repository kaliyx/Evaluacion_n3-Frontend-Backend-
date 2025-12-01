import React from 'react';
import { Card, Space, Button } from 'antd';
import { UserOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router'; 
import { styles } from '../../assets/styles';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.centeredFullHeight}>
      <Card title="Bienvenido a Urban Shop" style={styles.cardCenteredWidth400}>
        <p>Selecciona un rol para ingresar:</p>
        <Space orientation="vertical" style={styles.fullWidth}>
          <Button
            type="primary"
            icon={<ShopOutlined />}
            onClick={() => navigate('/login', { state: { role: 'vendedor' } })}
            style={styles.fullWidth}
          >
            Ingresar como Vendedor
          </Button>

          <Button icon={<UserOutlined />} onClick={() => navigate('/login', { state: { role: 'admin' } })} style={styles.fullWidth}>
            Ingresar como Administrador
          </Button>
        </Space>
      </Card>
    </div>
  );
}