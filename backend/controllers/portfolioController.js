const Portfolio = require('../models/Portfolio');
const Profile = require('../models/Profile');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getProfile, getPortfolio, logActivity } = require('../utils/userDocs');

const cleanProfile = (p) => {
  const o = p.toObject();
  delete o.activity;
  delete o.userId;
  delete o.__v;
  return o;
};

const cleanPortfolio = (p) => {
  const o = p.toObject();
  delete o.userId;
  delete o.__v;
  return o;
};

exports.getMine = asyncHandler(async (req, res) => {
  const [portfolio, profile] = await Promise.all([getPortfolio(req.user), getProfile(req.user)]);
  res.json({ success: true, portfolio: cleanPortfolio(portfolio), profile: cleanProfile(profile), user: { name: req.user.name, email: req.user.email } });
});

exports.updateMine = asyncHandler(async (req, res) => {
  const portfolio = await getPortfolio(req.user);
  const { slug } = req.body;
  if (slug && slug !== portfolio.slug) {
    if (await Portfolio.exists({ slug, _id: { $ne: portfolio._id } })) throw new ApiError(409, 'That portfolio link is already taken.');
    portfolio.slug = slug;
    await portfolio.save();
    await logActivity(req.user._id, 'Changed your portfolio link');
  }
  res.json({ success: true, portfolio: cleanPortfolio(portfolio) });
});

exports.publish = asyncHandler(async (req, res) => {
  const [portfolio, profile] = await Promise.all([getPortfolio(req.user), getProfile(req.user)]);
  if (!profile.professionalTitle && !profile.about) {
    throw new ApiError(400, 'Add a professional title or an About Me section before publishing.');
  }
  portfolio.isPublished = true;
  portfolio.publishedAt = new Date();
  await portfolio.save();
  await logActivity(req.user._id, 'Published your portfolio');
  res.json({ success: true, portfolio: cleanPortfolio(portfolio) });
});

exports.unpublish = asyncHandler(async (req, res) => {
  const portfolio = await getPortfolio(req.user);
  portfolio.isPublished = false;
  await portfolio.save();
  await logActivity(req.user._id, 'Unpublished your portfolio');
  res.json({ success: true, portfolio: cleanPortfolio(portfolio) });
});

// Public: no login required, but only published portfolios are returned.
exports.getPublic = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ slug: req.params.slug.toLowerCase(), isPublished: true });
  if (!portfolio) throw new ApiError(404, 'This portfolio is not available. It may be private or the link may be wrong.');
  const [user, profile] = await Promise.all([User.findById(portfolio.userId), Profile.findOne({ userId: portfolio.userId })]);
  if (!user || !profile) throw new ApiError(404, 'This portfolio is not available.');
  res.json({
    success: true,
    slug: portfolio.slug,
    template: portfolio.selectedTemplate,
    user: { name: user.name },
    profile: cleanProfile(profile),
  });
});
