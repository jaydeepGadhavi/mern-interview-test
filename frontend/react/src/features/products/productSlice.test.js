import { describe, expect, it } from 'vitest';
import reducer, { addProduct, editProduct, fetchProducts, removeProduct } from './productSlice';

const initial = reducer(undefined, { type: 'init' });
const pen = { id: '1', name: 'Pen', price: 5, description: '' };
const book = { id: '2', name: 'Book', price: 12, description: '' };

describe('productSlice', () => {
  it('stores fetched products', () => {
    const state = reducer(initial, fetchProducts.fulfilled([pen, book]));
    expect(state.items).toEqual([pen, book]);
    expect(state.status).toBe('idle');
  });

  it('adds a new product to the top of the list', () => {
    const state = reducer({ ...initial, items: [pen] }, addProduct.fulfilled(book));
    expect(state.items.map((p) => p.id)).toEqual(['2', '1']);
  });

  it('replaces an edited product', () => {
    const state = reducer({ ...initial, items: [pen, book] }, editProduct.fulfilled({ ...pen, price: 9 }));
    expect(state.items[0].price).toBe(9);
    expect(state.items).toHaveLength(2);
  });

  it('removes a deleted product', () => {
    const state = reducer({ ...initial, items: [pen, book] }, removeProduct.fulfilled('1'));
    expect(state.items).toEqual([book]);
  });

  it('records an error when a request is rejected', () => {
    const action = { type: fetchProducts.rejected.type, payload: 'Network down' };
    const state = reducer(initial, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Network down');
  });
});
