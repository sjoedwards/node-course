const handleError = (
  res,
  error,
  status = 400,
  message = "An unexpected error occured"
) => {
  console.log(`${message}: ${error}`);
  return res.status(status).send(message);
};

module.exports = handleError;
