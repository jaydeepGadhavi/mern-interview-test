const orderService = require('../services/order.service');
const asyncHandler = require('../utils/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const order = await orderService.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: order });
});

const getById = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await orderService.getById(req.params.id, req.user.id) });
});

const update = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await orderService.update(req.params.id, req.user.id, req.body) });
});

const remove = asyncHandler(async (req, res) => {
  await orderService.remove(req.params.id, req.user.id);
  res.status(204).send();
});

const list = asyncHandler(async (req, res) => {
  const data = await orderService.list(req.user.id);
  res.json({ success: true, data });
});

module.exports = { create, getById, list, update, remove };
