import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const BarraBusqueda = ({ onSearch }) => (
  <Search
    placeholder="Buscar por nombre o ID..."
    allowClear
    enterButton="Buscar"
    size="large"
    onSearch={onSearch}
    onChange={(e) => onSearch(e.target.value)}
  />
);

export default BarraBusqueda;
