import { jsPDF } from 'jspdf';
import { groupSkills, formatRange, yearRange } from './format';

// Standard PDF fonts only support Latin characters, so anything else is dropped to avoid garbled text.
const clean = (s) => String(s ?? '').replace(/[^\x09\x0A\x20-\x7E\u00A0-\u00FF\u2018\u2019\u201C\u201D\u2022]/g, '').replace(/\s+\n/g, '\n').trim();

export function downloadResume({ name, profile }) {
  const p = profile || {};
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 50;
  const maxW = W - M * 2;
  let y = M;

  const need = (h) => { if (y + h > H - M) { doc.addPage(); y = M; } };
  const text = (str, { size = 10, bold = false, color = [45, 45, 55], gap = 3, indent = 0, center = false } = {}) => {
    if (!clean(str)) return;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.splitTextToSize(clean(str), maxW - indent).forEach((line) => {
      need(size * 1.35);
      doc.text(line, center ? W / 2 : M + indent, y + size, center ? { align: 'center' } : undefined);
      y += size * 1.35;
    });
    y += gap;
  };
  const heading = (t) => {
    need(36);
    y += 8;
    text(t.toUpperCase(), { size: 10.5, bold: true, color: [40, 50, 130], gap: 1 });
    doc.setDrawColor(200, 205, 220);
    doc.line(M, y, W - M, y);
    y += 7;
  };
  const entry = (title, right, sub, body) => {
    text([title, right].filter(Boolean).join('   |   '), { bold: true, size: 10.5, gap: 1 });
    if (sub) text(sub, { color: [90, 95, 110], gap: 1 });
    if (body) text(body, { gap: 6 });
    else y += 4;
  };

  text(name, { size: 22, bold: true, color: [15, 23, 42], gap: 2 });
  text(p.professionalTitle, { size: 12, color: [70, 75, 100], gap: 4 });
  const s = p.socialLinks || {};
  const contact = [p.contactEmail, p.phone, [p.city, p.country].filter(Boolean).join(', '), s.linkedin, s.github, s.website].filter(Boolean);
  text(contact.join('  |  '), { size: 9, color: [90, 95, 110], gap: 4 });

  const summary = p.about || p.careerObjective;
  if (summary) { heading('Professional Summary'); text(p.careerObjective && p.about ? `${p.careerObjective}\n${p.about}` : summary); }

  if (p.education?.length) {
    heading('Education');
    p.education.forEach((e) => entry(e.collegeName, yearRange(e), [e.degree, e.branch].filter(Boolean).join(', ') + (e.grade ? `  -  ${e.grade}` : '')));
  }
  const groups = groupSkills(p.skills);
  if (groups.length) {
    heading('Technical Skills');
    groups.forEach((g) => text(`${g.category}: ${g.items.map((i) => i.name).join(', ')}`, { gap: 2 }));
  }
  if (p.projects?.length) {
    heading('Projects');
    p.projects.forEach((pr) => {
      entry(pr.name, '', pr.technologies?.length ? `Technologies: ${pr.technologies.join(', ')}` : '', [pr.description, pr.githubUrl && `GitHub: ${pr.githubUrl}`, pr.liveUrl && `Live: ${pr.liveUrl}`].filter(Boolean).join('\n'));
    });
  }
  if (p.experience?.length) {
    heading('Experience');
    p.experience.forEach((x) => entry(x.role, formatRange(x.startDate, x.endDate), x.organization, x.description));
  }
  if (p.certifications?.length) {
    heading('Certifications');
    p.certifications.forEach((c) => entry(c.name, formatRange(c.issueDate, ''), c.issuer, c.credentialUrl));
  }
  if (p.achievements?.length) {
    heading('Achievements');
    p.achievements.forEach((a) => entry(a.title, a.date, '', a.description));
  }
  const extra = [p.languages?.length && `Languages: ${p.languages.join(', ')}`, p.interests?.length && `Interests: ${p.interests.join(', ')}`, p.hobbies?.length && `Hobbies: ${p.hobbies.join(', ')}`].filter(Boolean);
  if (extra.length) { heading('Additional Information'); extra.forEach((t) => text(t, { gap: 2 })); }

  const file = clean(name).replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'Resume';
  doc.save(`${file}-Resume.pdf`);
}
