import React from 'react';
import { render, screen } from '@testing-library/react';
import BarraBusqueda from './BarraBusqueda.jsx';

test('BarraBusqueda component test - renders input placeholder', () => {
  const onSearch = vi.fn();
  render(<BarraBusqueda onSearch={onSearch} />);
  expect(screen.getByPlaceholderText(/Buscar por nombre o ID/i)).toBeInTheDocument();
});
