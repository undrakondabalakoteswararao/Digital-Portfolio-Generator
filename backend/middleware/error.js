exports.notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Central error handler: every thrown error ends up here.
exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong on the server.';
  let errors;

  if (err.name === 'ValidationError') {
    status = 400;
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = errors[0].message;
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0];
    message = field === 'email' ? 'An account with this email already exists.' : field === 'slug' ? 'That portfolio link is already taken.' : 'Duplicate value.';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier.';
  } else if (err.name === 'MulterError') {
    status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Image is too large. Maximum size is 2 MB.' : err.message;
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Something went wrong on the server.' : message, ...(errors && { errors }) });
};
