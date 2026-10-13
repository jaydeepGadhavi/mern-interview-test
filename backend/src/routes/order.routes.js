const router = require('express').Router();
const controller = require('../controllers/order.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const schemas = require('../validators');

router.use(authenticate);

router.get('/', controller.list);
router.post('/', validate(schemas.orderBody), controller.create);
router.get('/:id', validate(schemas.orderIdParam, 'params'), controller.getById);
router.put('/:id', validate(schemas.orderIdParam, 'params'), validate(schemas.orderBody), controller.update);
router.delete('/:id', validate(schemas.orderIdParam, 'params'), controller.remove);

module.exports = router;
