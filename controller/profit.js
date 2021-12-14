const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { StatusCodes } = require('http-status-codes');
const { getProfit } = require('../model/profit');
const { adminCheck } = require('../middleware/validation');

router.get('/', auth, adminCheck, async (req, res, next) => {
  try {
    const [data] = await getProfit();
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
