const { StatusCodes } = require('http-status-codes');

const adminCheck = async (req, res, next) => {
  try {
    const { admin } = req.user;
    if (admin === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: 'You are not logged in or you do not have permission to access this function.',
      });
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { adminCheck };
