const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { StatusCodes } = require('http-status-codes');
const { getDeposits } = require('../model/deposit');
const { prepareDeposit } = require('../service/deposit');
const { adminCheck, selfCheck, depositCheck, blockedCheck } = require('../middleware/validation');

router.get('/', auth, adminCheck, async (req, res, next) => {
  try {
    const data = await getDeposits();
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

router.get('/:cpf', auth, selfCheck, async (req, res, next) => {
  try {
    const { cpf } = req.params;
    const data = await getDeposits(cpf);
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

router.post('/', depositCheck, blockedCheck, async (req, res, next) => {
  try {
    const { receiver: cpf_body, value, currency } = req.body;
    const { depositValue, feeValue } = await prepareDeposit(cpf_body, value, currency);
    if (depositValue) {
      return res.status(StatusCodes.CREATED).send({
        message: 'Deposit was successful!',
        value: +depositValue,
        fee: +feeValue
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: 'Deposit failed.',
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
