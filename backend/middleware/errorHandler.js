const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' && !err.isOperational
    ? 'An error occurred' 
    : err.message;

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
