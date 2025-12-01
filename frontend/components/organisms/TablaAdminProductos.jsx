import React from 'react';
import { Table, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Boton from '../atoms/Boton';

const TablaAdminProductos = ({ datos, alEditar, alEliminar }) => {
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
          <Popconfirm title="¿Seguro de eliminar?" onConfirm={() => alEliminar(record.id)}>
            <Boton icono={<DeleteOutlined />} peligro tipo="primary" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table columns={columnas} dataSource={datos} rowKey="id" />;
};

export default TablaAdminProductos;
