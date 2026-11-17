const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getProfile, logActivity } = require('../utils/userDocs');
const { uploadDir } = require('../middleware/upload');

const SCALARS = ['professionalTitle', 'careerObjective', 'about', 'contactEmail', 'phone', 'city', 'country'];
const ARRAYS = { education: 'education', skills: 'skills', projects: 'projects', experience: 'experience', certifications: 'certifications', achievements: 'achievements' };
const STRING_LISTS = ['languages', 'interests', 'hobbies'];

const publicProfile = (p) => {
  const o = p.toObject();
  delete o.activity;
  delete o.userId;
  delete o.__v;
  return o;
};

exports.getProfile = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user);
  res.json({ success: true, profile: publicProfile(profile), user: { name: req.user.name, email: req.user.email } });
});

// Only whitelisted fields are applied. The owner is always req.user (from the JWT cookie).
exports.updateProfile = asyncHandler(async (req, res) => {
  const b = req.body;
  const profile = await getProfile(req.user);
  const touched = [];

  SCALARS.forEach((k) => {
    if (b[k] !== undefined) {
      profile[k] = b[k];
      if (!touched.includes('personal information')) touched.push('personal information');
    }
  });
  if (b.socialLinks && typeof b.socialLinks === 'object') {
    profile.socialLinks = {
      linkedin: b.socialLinks.linkedin || '',
      github: b.socialLinks.github || '',
      website: b.socialLinks.website || '',
      others: Array.isArray(b.socialLinks.others) ? b.socialLinks.others.slice(0, 10) : [],
    };
    touched.push('social links');
  }
  Object.keys(ARRAYS).forEach((k) => {
    if (Array.isArray(b[k])) {
      profile[k] = b[k];
      touched.push(k);
    }
  });
  STRING_LISTS.forEach((k) => {
    if (Array.isArray(b[k])) {
      profile[k] = b[k].map((s) => String(s).trim()).filter(Boolean).slice(0, 30);
      if (!touched.includes('additional information')) touched.push('additional information');
    }
  });
  if (b.name !== undefined) {
    req.user.name = b.name;
    await req.user.save();
  }

  await profile.save(); // runs the Mongoose schema validation
  if (touched.length) await logActivity(req.user._id, `Updated ${touched.join(', ')}`);
  res.json({ success: true, profile: publicProfile(profile), user: { name: req.user.name, email: req.user.email } });
});

const removeOldFile = (url) => {
  if (!url || !url.startsWith('/uploads/')) return;
  const file = path.join(uploadDir, path.basename(url));
  fs.unlink(file, () => {});
};

exports.uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Choose an image to upload.');
  const profile = await getProfile(req.user);
  removeOldFile(profile.profileImage);
  profile.profileImage = `/uploads/${req.file.filename}`;
  await profile.save();
  await logActivity(req.user._id, 'Updated your profile picture');
  res.json({ success: true, url: profile.profileImage, profile: publicProfile(profile) });
});

// Project images are only uploaded here; the URL is saved with the project when the user clicks "Save changes".
exports.uploadProjectImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Choose an image to upload.');
  res.json({ success: true, url: `/uploads/${req.file.filename}` });
});
