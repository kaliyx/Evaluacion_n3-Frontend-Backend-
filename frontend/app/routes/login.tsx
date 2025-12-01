import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router';

export default function Login() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const role = (location.state as any)?.role || 'vendedor';

  const onFinish = (values: any) => {
    const { username, password } = values;

    if (role === 'admin') {
      if (username === 'admin' && password === 'admin') {
        message.success('Ingreso exitoso como admin');
        navigate('/admin');
        return;
      }
    } else if (role === 'vendedor') {
      if (username === 'vendedor' && password === '1234') {
        message.success('Ingreso exitoso como vendedor');
        navigate('/vendedor');
        return;
      }
    }

    message.error('Usuario o contraseña incorrectos');
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
