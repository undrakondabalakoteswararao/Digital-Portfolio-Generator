const asyncHandler = require('../utils/asyncHandler');
const completion = require('../utils/completion');
const { getProfile, getPortfolio } = require('../utils/userDocs');

exports.stats = asyncHandler(async (req, res) => {
  const [profile, portfolio] = await Promise.all([getProfile(req.user), getPortfolio(req.user)]);
  const counts = {
    projects: profile.projects.length,
    skills: profile.skills.length,
    certifications: profile.certifications.length,
    education: profile.education.length,
    experience: profile.experience.length,
    achievements: profile.achievements.length,
  };
  res.json({
    success: true,
    name: req.user.name,
    counts,
    completion: completion(profile),
    portfolio: {
      slug: portfolio.slug,
      template: portfolio.selectedTemplate,
      isPublished: portfolio.isPublished,
      status: portfolio.isPublished ? 'Published' : 'Draft',
    },
    recentActivity: [...profile.activity].reverse().slice(0, 8),
  });
});
