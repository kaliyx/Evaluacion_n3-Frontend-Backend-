import React from 'react';
import { render, screen } from '@testing-library/react';
import TarjetaProducto from '../components/molecules/TarjetaProducto.jsx';

const producto = { id: 1, nombre: 'Prueba', precio: 12345, imagen: '' };

test('TarjetaProducto shows product name and price', () => {
  render(<TarjetaProducto producto={producto} alAgregar={() => {}} />);
  expect(screen.getByText('Prueba')).toBeInTheDocument();
  expect(screen.getByText('$12345')).toBeInTheDocument();
});
