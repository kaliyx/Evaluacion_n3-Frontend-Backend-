import React from 'react';
import { render, screen } from '@testing-library/react';
import Boton from '../components/atoms/Boton.jsx';

test('Boton renders text prop', () => {
  render(<Boton texto="Click me" />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
