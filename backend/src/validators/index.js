const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const registerAuth = Joi.object({
  username: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z0-9_.@+-]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'username may only contain letters, numbers, underscores, hyphens, @, and periods',
      'string.min': 'username must be at least 3 characters long',
      'string.max': 'username cannot exceed 50 characters',
      'any.required': 'username is required',
    }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]).{8,72}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
      'any.required': 'password is required',
    }),
});

const loginAuth = Joi.object({
  username: Joi.string().trim().required().messages({
    'any.required': 'username is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'password is required',
  }),
});

const auth = registerAuth;

const productBody = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().trim().allow('').max(500).default(''),
});

const productIdParam = Joi.object({ id: objectId.required() });

const orderBody = Joi.object({
  productIds: Joi.array().items(objectId).min(1).required(),
});

const orderIdParam = Joi.object({ id: Joi.number().integer().positive().required() });

const weatherQuery = Joi.object({
  city: Joi.string().trim().min(2).max(60),
});

module.exports = {
  auth,
  registerAuth,
  loginAuth,
  productBody,
  productIdParam,
  orderBody,
  orderIdParam,
  weatherQuery,
};
