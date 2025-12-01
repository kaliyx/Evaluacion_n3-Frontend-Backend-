import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, ShopOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router'; // Importación correcta para Remix/RRv7
import Boton from '../atoms/Boton';

const { Header, Content, Footer } = Layout;

const LayoutPrincipal = ({ children, rol }) => {
  const navigate = useNavigate();

  const itemsMenu = [];
  if (rol === 'admin') {
    itemsMenu.push({ key: '1', icon: <UserOutlined />, label: 'Administración' });
  } else if (rol === 'vendedor') {
    itemsMenu.push({ key: '2', icon: <ShopOutlined />, label: 'Ventas' });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div 
          className="logo" 
          style={{ color: 'white', fontSize: 20, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Urban Shop
        </div>
        
        <Menu 
          theme="dark" 
          mode="horizontal" 
          defaultSelectedKeys={['1']} 
          items={itemsMenu}
          style={{ flex: 1, minWidth: 0, marginLeft: 20 }}
        />
        
        <Boton 
          texto="Salir" 
          icono={<LogoutOutlined />} 
          tipo="primary" 
          peligro 
          onClick={() => navigate('/')} 
        />
      </Header>
      
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380, borderRadius: 8 }}>
          {children}
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Urban Shop ©2025 - Evaluación 3
      </Footer>
    </Layout>
  );
};

export default LayoutPrincipal;
