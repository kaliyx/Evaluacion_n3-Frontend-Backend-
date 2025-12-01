// Polyfill matchMedia early to avoid antd responsiveObserver errors
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
  // @ts-ignore
  window.matchMedia = (query: string) => ({ matches: false, media: query, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false });
}

import { vi } from 'vitest';
// Mock a minimal subset of antd used by the component to avoid jsdom/layout issues
vi.mock('antd', async () => {
  const React = await import('react');
  const Table = (props: any) => React.createElement('table', { 'data-testid': 'mock-table' }, React.createElement('thead', null, props.columns?.map((c: any) => React.createElement('th', { key: c.key }, c.title))));
  const Space = ({ children }: any) => React.createElement('div', null, children);
  const Modal = { confirm: () => {} };
  return { Table, Space, Modal };
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import TablaAdminProductos from './TablaAdminProductos.jsx';

test('TablaAdminProductos component test - renders column headers', () => {
  render(<TablaAdminProductos datos={[]} alEditar={() => {}} alEliminar={() => {}} />);
  expect(screen.getByText(/Nombre/i)).toBeInTheDocument();
  expect(screen.getByText(/Precio/i)).toBeInTheDocument();
});
