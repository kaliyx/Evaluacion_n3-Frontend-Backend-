import React from 'react';
import { ConfigProvider } from 'antd';
import { temaUrbanShop } from './temaGlobal';

export function AppAntdProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: temaUrbanShop.token,
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export const layoutStyles = {
  layout: { minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: 'white', fontSize: 20, fontWeight: 'bold', cursor: 'pointer' },
  menu: { flex: 1, minWidth: 0, marginLeft: 20 },
  content: { padding: '0 50px', marginTop: 20 },
  contentInner: { background: '#fff', padding: 24, minHeight: 380, borderRadius: 8 },
  footer: { textAlign: 'center' },
};
