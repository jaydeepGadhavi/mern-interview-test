jest.mock('../src/repositories/product.repository');

const productRepository = require('../src/repositories/product.repository');
const productService = require('../src/services/product.service');

describe('product.service', () => {
  beforeEach(() => jest.resetAllMocks());

  it('creates a product through the repository', async () => {
    productRepository.create.mockResolvedValue({ id: 'a1', name: 'Pen', price: 5 });
    const result = await productService.create({ name: 'Pen', price: 5 });
    expect(productRepository.create).toHaveBeenCalledWith({ name: 'Pen', price: 5 });
    expect(result.id).toBe('a1');
  });

  it('throws 404 when the product does not exist (getById)', async () => {
    productRepository.findById.mockResolvedValue(null);
    await expect(productService.getById('missing')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('throws 404 when updating a missing product', async () => {
    productRepository.update.mockResolvedValue(null);
    await expect(productService.update('missing', { name: 'x', price: 1 })).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('throws 404 when deleting a missing product', async () => {
    productRepository.remove.mockResolvedValue(null);
    await expect(productService.remove('missing')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('deletes an existing product', async () => {
    productRepository.remove.mockResolvedValue({ id: 'a1' });
    await expect(productService.remove('a1')).resolves.toBeUndefined();
  });
});
