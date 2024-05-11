// reference: https://github.com/webmakaka/Node.js-API-Masterclass-With-Express-MongoDB

const ErrorResponse = require('../errors/errorResponse');

const errorHandler = (err, req, res, next) => {
      let error = { ...err };

      error.message = err.message;

      if (err.name === 'PayloadTooLargeError') {
            const message = `request entity too large`;
            error = new ErrorResponse(message, 400);
      }

      if (err.name === 'CastError') {
            const message = `Resource not found`;
            error = new ErrorResponse(message, 404);
      }

      // Mongoose duplicate key
      if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new ErrorResponse(message, 400);
      }

      // Mongoose validation error
      if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map((val) => val.message);
            error = new ErrorResponse(message, 400);
      }

      if (err.name === 'UnhandledPromiseRejectionWarning') {
            const message = Object.values(err.errors).map((val) => val.message);
            error = new ErrorResponse(message, 400);
      }

      res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error',
      });
};

module.exports = errorHandler;
