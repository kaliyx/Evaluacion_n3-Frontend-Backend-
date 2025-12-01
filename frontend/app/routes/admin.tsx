import React, { useState, useEffect } from 'react';
import { message, Modal, Form, Input, InputNumber, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';

// IMPORTANTE: Ajusta estas rutas si tus carpetas tienen nombres distintos
import LayoutPrincipal from '../../components/layouts/LayoutPrincipal';
import TablaAdminProductos from '../../components/organisms/TablaAdminProductos';
import Boton from '../../components/atoms/Boton';
import api from '../api';

const { Option } = Select;

// Fallback minimal data
const DATOS_INICIALES: any[] = [];

export default function Admin() {
  const [productos, setProductos] = useState(DATOS_INICIALES);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getProductos()
      .then((data: any[]) => {
        if (!mounted) return;
        setProductos(data.map(p => ({ id: p.id, nombre: p.nombre, precio: Number(p.precio), stock: p.stock, descripcion: p.descripcion, categoria: p.categoria, imagen: p.imagen, estado: p.estado })));
      })
      .catch((err) => {
        console.warn('No se pudo cargar productos del backend, usando local mocks', err);
      })
      .finally(() => setLoading(false));

    return () => { mounted = false; };
  }, []);

  // Eliminar
  const eliminarProducto = async (id: any) => {
    try {
      await api.eliminarProducto(id);
      setProductos(productos.filter(p => p.id !== id));
      message.success('Producto eliminado');
    } catch (err) {
      const errMsg = (err as any)?.message || 'No se pudo eliminar el producto';
      message.error(errMsg);
      console.error('Error eliminando producto:', err);
    }
  };

  // Crear / Actualizar
  const guardarProducto = async (valores: any) => {
    const payload = {
      nombre: valores.nombre,
      descripcion: valores.descripcion || valores.nombre,
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      categoria: valores.categoria || 'accesorios',
      imagen: valores.imagen || '',
      imageFile: imageFile,
    };

    try {
      if (editing) {
        const updated = await api.actualizarProducto(editing.id, payload);
        setProductos(productos.map(p => p.id === editing.id ? { ...p, ...updated } : p));
        message.success('Producto actualizado');
      } else {
        const created = await api.crearProducto(payload);
        setProductos([...productos, { id: created.id, ...payload }]);
        message.success('Producto creado exitosamente');
      }
      setModalVisible(false);
      form.resetFields();
      setImageFile(null);
      setEditing(null);
    } catch (err) {
      const errMsg = (err as any)?.message || 'Error al guardar producto';
      message.error(errMsg);
      console.error('Error guardando producto:', err);
    }
  };

  return (
    <LayoutPrincipal rol="admin">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Gestión de Inventario</h1>
        <Boton 
          texto="Nuevo Producto" 
          tipo="primary" 
          icono={<PlusOutlined />} 
          onClick={() => { setEditing(null); form.resetFields(); setImageFile(null); setModalVisible(true); }} 
        />
      </div>

      <TablaAdminProductos 
        datos={productos} 
        alEliminar={eliminarProducto} 
        alEditar={(item: any) => {
          setEditing(item);
          form.setFieldsValue(item);
          setImageFile(null);
          setModalVisible(true);
        }} 
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
          <Form.Item name="descripcion" label="Descripción" rules={[{ required: true, min: 10 }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="precio" label="Precio" rules={[{ required: true }]}>
            <InputNumber prefix="$" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="categoria" label="Categoría">
            <Select>
              <Option value="hombres">Hombres</Option>
              <Option value="mujeres">Mujeres</Option>
              <Option value="niños">Niños</Option>
              <Option value="accesorios">Accesorios</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Imagen">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={({ fileList }) => {
                const f = fileList[0]?.originFileObj as File | undefined;
                setImageFile(f || null);
              }}
            >
              <Button icon={<UploadOutlined />}>Seleccionar imagen desde PC</Button>
            </Upload>
            {editing?.imagen && !imageFile && (
              <div style={{ marginTop: 8 }}>
                <img src={editing.imagen} alt="preview" style={{ maxWidth: '100%', maxHeight: 150 }} />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </LayoutPrincipal>
  );
}