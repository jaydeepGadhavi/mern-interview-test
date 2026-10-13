const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');

// Price comes from the database, never from the client, so totals can't be tampered with.
// Duplicate ids in productIds count once per occurrence (quantity).
async function calculateTotal(productIds) {
  const uniqueIds = [...new Set(productIds)];
  const products = await productRepository.findByIds(uniqueIds);

  if (products.length !== uniqueIds.length) {
    const found = new Set(products.map((p) => p.id));
    const missing = uniqueIds.filter((id) => !found.has(id));
    throw ApiError.badRequest('Some products do not exist', { missing });
  }

  const priceById = new Map(products.map((p) => [p.id, p.price]));
  const total = productIds.reduce((sum, id) => sum + priceById.get(id), 0);
  return Math.round(total * 100) / 100;
}

async function getOwnedOrder(orderId, userId) {
  const order = await orderRepository.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');
  if (order.userId !== userId) throw ApiError.forbidden('You do not own this order');
  return order;
}

async function create(userId, { productIds }) {
  const totalAmount = await calculateTotal(productIds);
  return orderRepository.create({ userId, productIds, totalAmount });
}

const getById = (orderId, userId) => getOwnedOrder(orderId, userId);

async function update(orderId, userId, { productIds }) {
  await getOwnedOrder(orderId, userId);
  const totalAmount = await calculateTotal(productIds);
  return orderRepository.update(orderId, { productIds, totalAmount });
}

async function remove(orderId, userId) {
  await getOwnedOrder(orderId, userId);
  await orderRepository.remove(orderId);
}

async function list(userId) {
  const orders = await orderRepository.findByUserId(userId);
  const allProductIds = [...new Set(orders.flatMap((o) => o.productIds || []))];
  const products = allProductIds.length > 0 ? await productRepository.findByIds(allProductIds) : [];
  const productMap = new Map(products.map((p) => [p.id, p]));

  return orders.map((o) => ({
    ...o,
    products: (o.productIds || []).map((id) => productMap.get(id) || { id, name: `Product #${id.slice(-6)}` }),
  }));
}

module.exports = { create, getById, list, update, remove };
