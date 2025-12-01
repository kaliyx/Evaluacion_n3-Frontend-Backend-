import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import API_BASE from '../config';

export default function Login() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const role = (location.state as any)?.role || 'vendedor';

  const onFinish = async (values: any) => {
    const { username, password } = values;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        message.error(err?.message || 'Usuario o contraseña incorrectos');
        return;
      }

      const data = await res.json();
      const { token, usuario } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      message.success('Ingreso exitoso');

      if (usuario?.rol === 'admin') navigate('/admin');
      else navigate('/vendedor');
    } catch (error) {
      message.error('Error conectando con el servidor');
      console.error('Login error', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title={`Login - ${role === 'admin' ? 'Administrador' : 'Vendedor'}`} style={{ width: 360 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Usuario" rules={[{ required: true }] }>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Contraseña" rules={[{ required: true }] }>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
