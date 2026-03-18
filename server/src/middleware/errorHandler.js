const errorHandler = (err, _req, res, _next) => {
  let error = { ...err, message: err.message };

  console.error('Error:', err);

  if (err.name === 'CastError') {
    error = { message: 'Resource not found', statusCode: 404 };
  }
  if (err.code === 11000) {
    error = { message: 'Duplicate field value entered', statusCode: 400 };
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((v) => v.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
