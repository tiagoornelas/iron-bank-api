const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { StatusCodes } = require('http-status-codes');
const { getPayments } = require('../model/payment');
const { preparePayment } = require('../service/payment');
const { adminCheck, selfCheck, paymentCheck, blockedCheck } = require('../middleware/validation');

router.get('/', auth, adminCheck, async (req, res, next) => {
  try {
    const data = await getPayments();
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

router.get('/:cpf', auth, selfCheck, async (req, res, next) => {
  try {
    const { cpf } = req.params;
    const data = await getPayments(cpf);
    return res.status(StatusCodes.OK).send(data);
  } catch (err) {
    return next(err);
  }
});

router.post('/', auth, paymentCheck, blockedCheck, async (req, res, next) => {
  try {
    const { cpf: cpf_token } = req.user;
    const { value } = req.bill;
    const response = await preparePayment(cpf_token, value);
    if (response) {
      return res.status(StatusCodes.OK).send({
        message: 'Bill succesfully paid [fictional].',
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: 'Payment failed.',
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
