import { Github, Linkedin, Globe, Link2, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { groupSkills, assetUrl, initialsOf } from '../utils/format';

const LINK_ICONS = { linkedin: Linkedin, github: Github, website: Globe, other: Link2 };
const CONTACT_ICONS = { mail: Mail, phone: Phone, pin: MapPin };

export const LinkIcon = ({ kind, size = 16 }) => { const I = LINK_ICONS[kind] || Link2; return <I size={size} aria-hidden="true" />; };
export const ContactIcon = ({ kind, size = 15 }) => { const I = CONTACT_ICONS[kind] || Mail; return <I size={size} aria-hidden="true" />; };

// Anchor that opens externally and safely
export function Ext({ href, children, className = '', ...rest }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>{children}</a>;
}
export const ExtIcon = () => <ExternalLink size={14} aria-hidden="true" />;

export function Avatar({ src, name, className = '' }) {
  return src ? (
    <img src={assetUrl(src)} alt={name} className={`object-cover ${className}`} />
  ) : (
    <div className={`grid place-items-center font-bold ${className}`} aria-label={name}>{initialsOf(name)}</div>
  );
}

// Turns raw {name, profile} into everything a template needs. Sections are only shown if they have content.
export function prepare({ name, profile }) {
  const p = profile || {};
  const s = p.socialLinks || {};
  const location = [p.city, p.country].filter(Boolean).join(', ');
  const links = [
    s.linkedin && { label: 'LinkedIn', url: s.linkedin, kind: 'linkedin' },
    s.github && { label: 'GitHub', url: s.github, kind: 'github' },
    s.website && { label: 'Website', url: s.website, kind: 'website' },
    ...(s.others || []).filter((o) => o.url).map((o) => ({ label: o.label || 'Link', url: o.url, kind: 'other' })),
  ].filter(Boolean);
  const contact = [
    p.contactEmail && { kind: 'mail', label: p.contactEmail, href: `mailto:${p.contactEmail}` },
    p.phone && { kind: 'phone', label: p.phone, href: `tel:${p.phone.replace(/\s/g, '')}` },
    location && { kind: 'pin', label: location },
  ].filter(Boolean);
  return {
    name, p, links, contact, location,
    title: p.professionalTitle, objective: p.careerObjective, about: p.about, image: p.profileImage,
    skillGroups: groupSkills(p.skills),
    education: p.education || [], projects: p.projects || [], experience: p.experience || [],
    certifications: p.certifications || [], achievements: p.achievements || [],
    languages: p.languages || [], interests: p.interests || [], hobbies: p.hobbies || [],
  };
}
