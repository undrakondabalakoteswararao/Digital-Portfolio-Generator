// CSRF protection: browsers cannot attach custom headers on cross-site form posts,
// and CORS blocks cross-origin scripts from doing it. Combined with SameSite cookies,
// state-changing requests must carry this header.
module.exports = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-Requested-With') !== 'PortfolioForge') {
    return res.status(403).json({ success: false, message: 'Blocked by CSRF protection.' });
  }
  next();
};
