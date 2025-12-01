import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, ShopOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router'; // Importación correcta para Remix/RRv7
import Boton from '../atoms/Boton';
import { AppAntdProvider, layoutStyles } from '../../assets/antdConfig';

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
    <AppAntdProvider>
      <Layout style={layoutStyles.layout}>
        <Header style={layoutStyles.header}>
          <div className="logo" style={layoutStyles.logo} onClick={() => navigate('/')}>
            Urban Shop
          </div>

          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={itemsMenu}
            style={layoutStyles.menu}
          />

          <Boton texto="Salir" icono={<LogoutOutlined />} tipo="primary" peligro onClick={() => navigate('/')} />
        </Header>

        <Content style={layoutStyles.content}>
          <div style={layoutStyles.contentInner}>{children}</div>
        </Content>

        <Footer style={layoutStyles.footer}>Urban Shop ©2025 - Evaluación 3</Footer>
      </Layout>
    </AppAntdProvider>
  );
};

export default LayoutPrincipal;
