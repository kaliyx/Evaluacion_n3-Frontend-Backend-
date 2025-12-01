import React from 'react';
import { Button } from 'antd';

const Boton = ({ 
  texto, 
  tipo = "primary", 
  onClick, 
  icono, 
  peligro, 
  htmlType, 
  block, 
  size,
  style
}) => (
  <Button 
    type={tipo} 
    onClick={onClick} 
    icon={icono} 
    danger={peligro} 
    htmlType={htmlType}
    block={block}
    size={size}
    style={style}
  >
    {texto}
  </Button>
);

export default Boton;
