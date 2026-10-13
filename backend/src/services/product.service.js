const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');

const list = () => productRepository.findAll();

async function getById(id) {
  const product = await productRepository.findById(id);
  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

const create = (data) => productRepository.create(data);

async function update(id, data) {
  const product = await productRepository.update(id, data);
  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

async function remove(id) {
  const product = await productRepository.remove(id);
  if (!product) throw ApiError.notFound('Product not found');
}

module.exports = { list, getById, create, update, remove };
