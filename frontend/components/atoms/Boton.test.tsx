import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Boton from './Boton.jsx';

test('Boton component test - renders text and handles click', () => {
  const onClick = vi.fn();
  const { getByText } = render(<Boton texto="Probar" onClick={onClick} />);
  const btn = getByText('Probar');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(onClick).toHaveBeenCalled();
});
