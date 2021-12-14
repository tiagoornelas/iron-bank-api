const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { StatusCodes } = require('http-status-codes');
const { getUsers, getUser } = require('../model/user');
const { prepareUserCreation } = require('../service/user');
const { adminCheck, selfCheck, userCheck } = require('../middleware/validation');

router.get('/', auth, adminCheck, async (req, res, next) => {
  try {
    const data = await getUsers();
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

router.get('/:cpf', auth, selfCheck, async (req, res, next) => {
  try {
    const { cpf } = req.params;
    const data = await getUser(cpf);
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

router.post('/', userCheck, async (req, res, next) => {
  try {
    const data = await prepareUserCreation(req);
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
