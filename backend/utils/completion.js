// Profile completion: each check is one equal share of 100%.
module.exports = function completion(profile) {
  const s = profile.socialLinks || {};
  const checks = [
    ['Professional title', !!profile.professionalTitle],
    ['About me', !!profile.about],
    ['Contact details', !!(profile.phone || profile.contactEmail)],
    ['Location', !!(profile.city || profile.country)],
    ['Profile picture', !!profile.profileImage],
    ['Social links', !!(s.linkedin || s.github || s.website)],
    ['Education', profile.education.length > 0],
    ['Skills', profile.skills.length > 0],
    ['Projects', profile.projects.length > 0],
    ['Experience, certifications or achievements', profile.experience.length + profile.certifications.length + profile.achievements.length > 0],
  ];
  const done = checks.filter(([, ok]) => ok).length;
  return { percentage: Math.round((done / checks.length) * 100), missing: checks.filter(([, ok]) => !ok).map(([label]) => label) };
};
