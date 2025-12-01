import React from 'react';
import { render, screen } from '@testing-library/react';
import TarjetaProducto from './TarjetaProducto.jsx';

const producto = { id: 1, nombre: 'Prueba', precio: 12345, imagen: null };

test('TarjetaProducto component test - renders name and price; no img when imagen is null', () => {
  // Use alt-based query for the product image so antd icon svgs (role=img) don't interfere
  const { queryByAltText } = render(<TarjetaProducto producto={producto} alAgregar={() => {}} />);
  expect(screen.getByText('Prueba')).toBeInTheDocument();
  expect(screen.getByText('$12345')).toBeInTheDocument();
  expect(queryByAltText('Prueba')).toBeNull();
});
