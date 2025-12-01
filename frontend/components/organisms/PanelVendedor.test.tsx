// Polyfills and mocks must be set before importing components that pull in antd internals
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
  // @ts-ignore
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof window !== 'undefined' && !('getComputedStyle' in window)) {
  // @ts-ignore
  window.getComputedStyle = (elt: Element) => ({ getPropertyValue: () => '' });
}

import { vi } from 'vitest';
// Mock antd primitives, including List.Item and List.Item.Meta, to match component usage
vi.mock('antd', async () => {
  const React = await import('react');
  const List = (props: any) => React.createElement('div', { 'data-testid': 'mock-list' }, props.dataSource?.map((item: any, i: number) => (typeof props.renderItem === 'function' ? props.renderItem(item) : null)));
  // Provide List.Item and List.Item.Meta under List namespace
  // List.Item: simple container that renders children and optional actions
  // List.Item.Meta: renders title and description
  // @ts-ignore
  List.Item = ({ children, actions }: any) => React.createElement('div', { 'data-testid': 'mock-list-item' },
    React.createElement('div', null, children),
    actions ? React.createElement('div', { 'data-testid': 'mock-list-item-actions' }, actions) : null
  );
  // @ts-ignore
  List.Item.Meta = ({ title, description }: any) => React.createElement('div', { 'data-testid': 'mock-list-item-meta' },
    title ? React.createElement('div', null, title) : null,
    description ? React.createElement('div', null, description) : null
  );

  const Typography = { Title: ({ children, level }: any) => React.createElement(`h${level || 1}`, null, children) };
  const Divider = () => React.createElement('hr', null);
  const Button = (props: any) => React.createElement('button', props, props.children);
  return { List, Typography, Divider, Button };
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PanelVendedor from './PanelVendedor.jsx';

test('PanelVendedor component test - shows total and calls alPagar', () => {
  const carrito = [{ id: 1, nombre: 'A', cantidad: 2, precio: 10 }];
  const total = 20;
  const alEliminarItem = vi.fn();
  const alPagar = vi.fn();

  render(<PanelVendedor carrito={carrito} total={total} alEliminarItem={alEliminarItem} alPagar={alPagar} />);

  expect(screen.getByText(/Total:/i)).toBeInTheDocument();
  // Use getAllByText in case multiple occurrences of the same total appear
  const totals = screen.getAllByText(`$${total}`);
  expect(totals.length).toBeGreaterThan(0);

  const boton = screen.getByRole('button', { name: /Realizar Pago/i });
  fireEvent.click(boton);
  expect(alPagar).toHaveBeenCalled();
});
