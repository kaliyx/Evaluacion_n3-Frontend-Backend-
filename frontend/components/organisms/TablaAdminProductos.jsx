import React from 'react';
import { Table, Space, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Boton from '../atoms/Boton';

const TablaAdminProductos = ({ datos, alEditar, alEliminar }) => {
  const { confirm } = Modal;

  const showConfirm = (id) => {
    confirm({
      title: '¿Seguro de eliminar?',
      okText: 'Sí',
      cancelText: 'No',
      centered: true,
      onOk() {
        alEliminar(id);
      },
    });
  };

  const columnas = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Precio', dataIndex: 'precio', key: 'precio', render: (text) => `$${text}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="middle">
          <Boton 
            icono={<EditOutlined />} 
            onClick={() => alEditar(record)} 
            tipo="default" 
          />
          <Boton icono={<DeleteOutlined />} peligro tipo="primary" onClick={() => showConfirm(record.id)} />
        </Space>
      ),
    },
  ];

  return <Table columns={columnas} dataSource={datos} rowKey="id" />;
};

export default TablaAdminProductos;
