const Profile = require('../models/Profile');
const Portfolio = require('../models/Portfolio');
const { uniqueSlug } = require('./slug');

// "Get or create" keeps the app working even if a related document is missing.
async function getProfile(user) {
  let profile = await Profile.findOne({ userId: user._id });
  if (!profile) profile = await Profile.create({ userId: user._id, contactEmail: user.email });
  return profile;
}

async function getPortfolio(user) {
  let portfolio = await Portfolio.findOne({ userId: user._id });
  if (!portfolio) portfolio = await Portfolio.create({ userId: user._id, slug: await uniqueSlug(user.name) });
  return portfolio;
}

const logActivity = (userId, message) =>
  Profile.updateOne({ userId }, { $push: { activity: { $each: [{ message, at: new Date() }], $slice: -20 } } });

module.exports = { getProfile, getPortfolio, logActivity };
