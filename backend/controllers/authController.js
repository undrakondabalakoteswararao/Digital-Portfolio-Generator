const User = require('../models/User');
const Profile = require('../models/Profile');
const Portfolio = require('../models/Portfolio');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { uniqueSlug } = require('../utils/slug');
const { sendAuthCookie, clearAuthCookie } = require('../utils/token');
const { logActivity } = require('../utils/userDocs');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) throw new ApiError(409, 'An account with this email already exists.');

  const user = await User.create({ name, email, password });
  await Profile.create({ userId: user._id, contactEmail: user.email });
  await Portfolio.create({ userId: user._id, slug: await uniqueSlug(user.name) });
  await logActivity(user._id, 'Created your account');

  sendAuthCookie(res, user);
  res.status(201).json({ success: true, user });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  // Same message for unknown email and wrong password, so attackers cannot discover registered emails
  if (!user || !(await user.matchPassword(password))) throw new ApiError(401, 'Incorrect email or password.');
  sendAuthCookie(res, user);
  res.json({ success: true, user });
});

exports.logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out.' });
};

exports.me = (req, res) => res.json({ success: true, user: req.user });

exports.updateAccount = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (email !== req.user.email && (await User.exists({ email, _id: { $ne: req.user._id } }))) {
    throw new ApiError(409, 'An account with this email already exists.');
  }
  req.user.name = name;
  req.user.email = email;
  await req.user.save();
  res.json({ success: true, user: req.user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(req.body.currentPassword))) throw new ApiError(401, 'Current password is incorrect.');
  user.password = req.body.newPassword; // hashed by the pre-save hook
  await user.save();
  await logActivity(user._id, 'Changed your password');
  res.json({ success: true, message: 'Password updated.' });
});
