import React from 'react';
import { render } from '@testing-library/react';
import LayoutPrincipal from './LayoutPrincipal.jsx';

// Mock react-router's useNavigate to avoid errors when rendering layout
vi.mock('react-router', () => ({ useNavigate: () => vi.fn() }));

test('LayoutPrincipal component test - renders children and header', () => {
  const { container } = render(
    <LayoutPrincipal rol="admin">
      <div>Contenido</div>
    </LayoutPrincipal>
  );
  expect(container.textContent).toContain('Urban Shop');
  expect(container.textContent).toContain('Contenido');
});
