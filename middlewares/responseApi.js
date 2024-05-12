const success = (message, results, statusCode) => ({
  message,
  success: true,
  code: statusCode,
  results,
});

module.exports = success;
