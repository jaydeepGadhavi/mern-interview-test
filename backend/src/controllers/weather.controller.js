const weatherService = require('../services/weather.service');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');

const current = asyncHandler(async (req, res) => {
  const city = req.query.city || env.defaultCity;
  res.json({ success: true, data: await weatherService.getCurrentWeather(city) });
});

module.exports = { current };
