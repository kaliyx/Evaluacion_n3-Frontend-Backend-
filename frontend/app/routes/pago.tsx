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
  const [form] = Form.useForm();

  const finalizarCompra = (valores: any) => {
    // TODO: enviar datos al backend para procesar el pago y guardar la boleta
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
          <Form form={form} onFinish={finalizarCompra} layout="vertical">
            <Form.Item
              label="Nombre"
              name="nombre"
              rules={[{ required: true, message: 'Ingrese el nombre del cliente' }]}
            >
              <Input placeholder="Nombre del cliente" />
            </Form.Item>

            <Form.Item label="Método de Pago" name="metodo" rules={[{ required: true, message: 'Seleccione un método de pago' }]}>
              <Radio.Group>
                <Radio value="efectivo">Efectivo</Radio>
                <Radio value="debito">Débito</Radio>
                <Radio value="credito">Crédito</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Campos condicionales para tarjeta */}
            <Form.Item shouldUpdate={(prev, cur) => prev.metodo !== cur.metodo} noStyle>
              {() => {
                const metodo = form.getFieldValue('metodo');
                if (metodo === 'debito' || metodo === 'credito') {
                  return (
                    <>
                      <Form.Item
                        label="Número de Tarjeta"
                        name="numeroTarjeta"
                        rules={[
                          { required: true, message: 'Ingrese el número de la tarjeta' },
                          { pattern: /^\d{12,19}$/, message: 'Número de tarjeta inválido' },
                        ]}
                      >
                        <Input placeholder="1234 5678 9012 3456" maxLength={19} />
                      </Form.Item>

                      <Form.Item
                        label="PVV"
                        name="pvv"
                        rules={[{ required: true, message: 'Ingrese el PVV/CVV' }, { pattern: /^\d{3,4}$/, message: 'PVV inválido' }]}
                      >
                        <Input placeholder="123" maxLength={4} />
                      </Form.Item>

                      <Form.Item
                        label="Fecha de Vencimiento (MM/AA)"
                        name="vencimiento"
                        rules={[
                          { required: true, message: 'Ingrese la fecha de vencimiento' },
                          { pattern: /^(0[1-9]|1[0-2])\/(\d{2})$/, message: 'Formato inválido. Use MM/AA' },
                        ]}
                      >
                        <Input placeholder="MM/AA" maxLength={5} />
                      </Form.Item>
                    </>
                  );
                }
                return null;
              }}
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