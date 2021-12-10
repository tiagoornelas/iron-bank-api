const router = require('express').Router();
const { getUsers, getUser } = require('../model/user');
const { StatusCodes } = require('http-status-codes');
const { adminCheck, selfCheck } = require('../middleware/validation');

router.get('/', adminCheck, async (req, res, next) => {
  try {
    const data = await getUsers();
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

router.get('/:cpf', selfCheck, async (req, res, next) => {
  try {
    const { cpf } = req.params;
    const data = await getUser(cpf);
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
