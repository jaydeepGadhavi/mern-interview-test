const router = require('express').Router();
const controller = require('../controllers/product.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const schemas = require('../validators');

// Reads are public; writes require a valid JWT.
router.get('/', controller.list);
router.get('/:id', validate(schemas.productIdParam, 'params'), controller.getById);
router.post('/', authenticate, validate(schemas.productBody), controller.create);
router.put(
  '/:id',
  authenticate,
  validate(schemas.productIdParam, 'params'),
  validate(schemas.productBody),
  controller.update
);
router.delete('/:id', authenticate, validate(schemas.productIdParam, 'params'), controller.remove);

module.exports = router;
