const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { COOKIE_NAME } = require('../utils/token');

// The user id always comes from the verified cookie - never from the request body.
exports.protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) throw new ApiError(401, 'Please log in to continue.');
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'Account not found. Please log in again.');
  req.user = user;
  next();
});
