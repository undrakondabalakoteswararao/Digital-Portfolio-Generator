export const SKILL_CATEGORIES = ['Programming Languages', 'Web Technologies', 'Databases', 'Frameworks', 'Tools', 'Other Skills'];

export function groupSkills(skills = []) {
  return SKILL_CATEGORIES.map((category) => ({ category, items: skills.filter((s) => s.category === category) })).filter((g) => g.items.length);
}

export function formatMonth(v) {
  if (!v) return '';
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(v);
  if (!m) return v;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3] || 1));
  return d.toLocaleDateString('en-US', m[3] ? { day: 'numeric', month: 'short', year: 'numeric' } : { month: 'short', year: 'numeric' });
}

export function formatRange(start, end) {
  const s = formatMonth(start);
  const e = formatMonth(end);
  if (!s && !e) return '';
  return `${s}${s ? ' - ' : ''}${e || (s ? 'Present' : '')}`;
}

export const yearRange = (e) => [e.startYear, e.graduationYear].filter(Boolean).join(' - ');
export const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };
export const initialsOf = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
export const assetUrl = (p) => (!p ? '' : /^https?:/i.test(p) ? p : `${import.meta.env.VITE_ASSET_URL || ''}${p}`);
export const publicUrl = (slug) => `${window.location.origin}/portfolio/${slug}`;
export const URL_PATTERN = /^https?:\/\/\S+\.\S+$/i;
export const timeAgo = (iso) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
};
