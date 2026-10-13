const Product = require('../models/product.model');

// Repository = the only layer that talks to MongoDB for products (CRUD).
const create = (data) => Product.create(data);

const findAll = () => Product.find({ softDelete: { $ne: true } }).sort({ createdAt: -1 });

const findById = (id) => Product.findOne({ _id: id, softDelete: { $ne: true } });

const findByIds = (ids) => Product.find({ _id: { $in: ids }, softDelete: { $ne: true } });

const update = (id, data) =>
  Product.findOneAndUpdate({ _id: id, softDelete: { $ne: true } }, data, { new: true, runValidators: true });

// Soft delete: sets softDelete = true and deletedAt timestamp instead of removing the document
const remove = (id) =>
  Product.findOneAndUpdate(
    { _id: id, softDelete: { $ne: true } },
    { softDelete: true, deletedAt: new Date() },
    { new: true }
  );

module.exports = { create, findAll, findById, findByIds, update, remove };
