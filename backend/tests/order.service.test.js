jest.mock('../src/repositories/order.repository');
jest.mock('../src/repositories/product.repository');

const orderRepository = require('../src/repositories/order.repository');
const productRepository = require('../src/repositories/product.repository');
const orderService = require('../src/services/order.service');

const A = 'a'.repeat(24);
const B = 'b'.repeat(24);

describe('order.service', () => {
  beforeEach(() => jest.resetAllMocks());

  it('calculates the total from database prices (counting duplicates)', async () => {
    productRepository.findByIds.mockResolvedValue([
      { id: A, price: 10.5 },
      { id: B, price: 4.25 },
    ]);
    orderRepository.create.mockImplementation(async (data) => ({ orderId: 1, ...data }));

    const order = await orderService.create(7, { productIds: [A, A, B] });

    expect(orderRepository.create).toHaveBeenCalledWith({
      userId: 7,
      productIds: [A, A, B],
      totalAmount: 25.25,
    });
    expect(order.totalAmount).toBe(25.25);
  });

  it('rejects an order containing unknown products with 400', async () => {
    productRepository.findByIds.mockResolvedValue([{ id: A, price: 10 }]);
    await expect(orderService.create(7, { productIds: [A, B] })).rejects.toMatchObject({ statusCode: 400 });
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('returns 404 for a missing order', async () => {
    orderRepository.findById.mockResolvedValue(null);
    await expect(orderService.getById(1, 7)).rejects.toMatchObject({ statusCode: 404 });
  });

  it("returns 403 when reading another user's order", async () => {
    orderRepository.findById.mockResolvedValue({ orderId: 1, userId: 99 });
    await expect(orderService.getById(1, 7)).rejects.toMatchObject({ statusCode: 403 });
  });

  it('recalculates the total on update', async () => {
    orderRepository.findById.mockResolvedValue({ orderId: 1, userId: 7 });
    productRepository.findByIds.mockResolvedValue([{ id: B, price: 4 }]);
    orderRepository.update.mockImplementation(async (id, data) => ({ orderId: id, ...data }));

    const order = await orderService.update(1, 7, { productIds: [B, B] });
    expect(order.totalAmount).toBe(8);
  });

  it('does not delete an order the user does not own', async () => {
    orderRepository.findById.mockResolvedValue({ orderId: 1, userId: 99 });
    await expect(orderService.remove(1, 7)).rejects.toMatchObject({ statusCode: 403 });
    expect(orderRepository.remove).not.toHaveBeenCalled();
  });
});
