const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const schemas = require('../validators');

router.post('/register', validate(schemas.registerAuth || schemas.auth), controller.register);
router.post('/login', validate(schemas.loginAuth || schemas.auth), controller.login);

module.exports = router;
