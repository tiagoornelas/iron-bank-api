const router = require('express').Router();
const { getUsers } = require('../model/user');
const { StatusCodes } = require('http-status-codes');

router.get('/', async (req, res, next) => {
  try {
    const data = await getUsers();
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
