const router = require('express').Router();
const controller = require('../controllers/weather.controller');
const validate = require('../middlewares/validate');
const schemas = require('../validators');

router.get('/', validate(schemas.weatherQuery, 'query'), controller.current);

module.exports = router;
