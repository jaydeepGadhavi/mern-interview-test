const ApiError = require('../utils/ApiError');

// validate(schema, 'body' | 'params' | 'query')
module.exports = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
  if (error) {
    return next(
      ApiError.badRequest(
        'Validation failed',
        error.details.map((d) => d.message)
      )
    );
  }
  req[source] = value;
  return next();
};
