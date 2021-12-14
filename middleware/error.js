const error = async (err, req, res) => {
  console.log(err.message);
  return res.status(500).send({
    message: err.message,
  });
};

module.exports = error;
