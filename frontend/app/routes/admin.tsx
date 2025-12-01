import React, { useState } from 'react';
import { message, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// IMPORTANTE: Ajusta estas rutas si tus carpetas tienen nombres distintos
import LayoutPrincipal from '../../components/layouts/LayoutPrincipal';
import TablaAdminProductos from '../../components/organisms/TablaAdminProductos';
import Boton from '../../components/atoms/Boton';

// Datos Mock (Simulación BD)
const DATOS_INICIALES = [
  { id: 1, nombre: 'Gorra Urbana', precio: 12000, stock: 20 },
  { id: 2, nombre: 'Zapatillas Skate', precio: 45000, stock: 5 },
];

export default function Admin() {
  const [productos, setProductos] = useState(DATOS_INICIALES);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Eliminar
  const eliminarProducto = (id: any) => {
    setProductos(productos.filter(p => p.id !== id));
    message.success('Producto eliminado');
  };

  // Crear
  const guardarProducto = (valores: any) => {
    const nuevo = { ...valores, id: Date.now() };
    setProductos([...productos, nuevo]);
    setModalVisible(false);
    form.resetFields();
    message.success('Producto creado exitosamente');
  };

  return (
    <LayoutPrincipal rol="admin">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Gestión de Inventario</h1>
        <Boton 
          texto="Nuevo Producto" 
          tipo="primary" 
          icono={<PlusOutlined />} 
          onClick={() => setModalVisible(true)} 
        />
      </div>

      <TablaAdminProductos 
        datos={productos} 
        alEliminar={eliminarProducto} 
        alEditar={(item: any) => message.info(`Editar: ${item.nombre}`)} 
      />

      <Modal
        title="Agregar Producto"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={guardarProducto} layout="vertical">
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="precio" label="Precio" rules={[{ required: true }]}>
            <InputNumber prefix="$" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </LayoutPrincipal>
  );
}