const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id';
  }
  if (err.code === 'ER_DUP_ENTRY') {
    status = 409;
    message = 'Resource already exists';
  }
  if (status === 500) {
    console.error(err);
    message = 'Internal server error';
  }

  res.status(status).json({ success: false, message, details: err.details });
}

module.exports = { notFound, errorHandler };
