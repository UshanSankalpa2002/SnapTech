// middleware/errorMiddleware.js

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  console.error('Error Details:');
  console.error('Status Code:', statusCode);
  console.error('Message:', message);
  console.error('Stack:', err.stack);
  console.error('Request Body:', req.body);
  console.error('Request Files:', req.files);
  console.error('Request Headers:', req.headers);

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const duplicateField = Object.keys(err.keyValue)[0];
    message = `${duplicateField} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(val => val.message);
    message = `Validation Error: ${errors.join(', ')}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large. Maximum size is 5MB';
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    statusCode = 400;
    message = 'Too many files. Maximum 5 files allowed';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field';
  }

  // Handle multer file type errors
  if (err.message === 'Images only!') {
    statusCode = 400;
    message = 'Only image files are allowed (jpeg, jpg, png, gif, webp)';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    ...(process.env.NODE_ENV === 'development' && {
      requestBody: req.body,
      requestFiles: req.files ? req.files.map(f => ({ 
        fieldname: f.fieldname, 
        originalname: f.originalname, 
        mimetype: f.mimetype, 
        size: f.size 
      })) : null
    })
  });
};

module.exports = {
  notFound,
  errorHandler,
};