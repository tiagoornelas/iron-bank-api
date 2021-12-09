const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const { checkCredentials } = require('../service/login');

router.post('/', async (req, res, next) => {
  try {
    const { cpf, password } = req.body;
    const data = await checkCredentials(cpf, password);
    if (data.success) {
      return res.status(StatusCodes.OK).send(data.response);
    }
    return res.status(StatusCodes.UNAUTHORIZED).send({
      message: 'Invalid login or password.',
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
