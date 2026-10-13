const productService = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await productService.list() });
});

const getById = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await productService.getById(req.params.id) });
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await productService.create(req.body) });
});

const update = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await productService.update(req.params.id, req.body) });
});

const remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { list, getById, create, update, remove };
