import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Card, Radio, Form, Input, Result } from 'antd';
import LayoutPrincipal from '../../components/layouts/LayoutPrincipal';
import Boton from '../../components/atoms/Boton';

export default function Pago() {
  const location = useLocation();
  const navigate = useNavigate();
  // Recuperar datos pasados desde la ruta anterior
  const { carrito, total } = location.state || { carrito: [], total: 0 };
  const [pagado, setPagado] = useState(false);

  const finalizarCompra = (valores: any) => {
    console.log("Datos enviados al backend:", { carrito, total, metodo: valores.metodo });
    setPagado(true);
  };

  if (pagado) {
    return (
      <LayoutPrincipal rol="vendedor">
        <Result
          status="success"
          title="¡Pago Realizado con Éxito!"
          subTitle={`Boleta Generada. Total pagado: $${total}`}
          extra={[
            <Boton key="back" texto="Volver a Tienda" onClick={() => navigate('/vendedor')} tipo="primary" />,
            <Boton key="print" texto="Imprimir Boleta" onClick={() => window.print()} />
          ]}
        />
      </LayoutPrincipal>
    );
  }

  return (
    <LayoutPrincipal rol="vendedor">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Card title="Finalizar Compra - Datos de Pago">
          <Form onFinish={finalizarCompra} layout="vertical">
            <Form.Item label="Cliente (Opcional)" name="cliente">
               <Input placeholder="Nombre del cliente" />
            </Form.Item>
            
            <Form.Item label="Método de Pago" name="metodo" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="efectivo">Efectivo</Radio>
                <Radio value="debito">Débito</Radio>
                <Radio value="credito">Crédito</Radio>
              </Radio.Group>
            </Form.Item>

            <div style={{ marginBottom: 20 }}>
               <h3>Total a Pagar: ${total}</h3>
            </div>

            <Boton texto="Confirmar Pago" htmlType="submit" tipo="primary" style={{ width: '100%' }} />
          </Form>
        </Card>
      </div>
    </LayoutPrincipal>
  );
}