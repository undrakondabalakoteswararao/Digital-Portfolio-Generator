const Portfolio = require('../models/Portfolio');

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 34);

async function uniqueSlug(name) {
  let base = slugify(name) || 'portfolio';
  if (base.length < 3) base = `${base}-portfolio`;
  let slug = base;
  let tries = 0;
  while (await Portfolio.exists({ slug })) {
    tries += 1;
    slug = tries > 20 ? `${base}-${Date.now()}` : `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  return slug;
}

module.exports = { slugify, uniqueSlug };
