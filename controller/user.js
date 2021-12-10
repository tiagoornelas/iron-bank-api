const router = require('express').Router();
const { getUsers } = require('../model/user');
const { StatusCodes } = require('http-status-codes');
const { adminCheck } = require('../middleware/validation');

router.get('/', adminCheck, async (req, res, next) => {
  try {
    const data = await getUsers();
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
