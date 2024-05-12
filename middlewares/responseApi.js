const success = (message, results, statusCode) => {
  return {
    message,
    success: true,
    code: statusCode,
    results,
  };
};

module.exports = success