import { prepare, LinkIcon, ContactIcon, Ext, ExtIcon, Avatar } from './shared';
import { formatRange, formatMonth, yearRange } from '../utils/format';
import { assetUrl } from '../utils/format';

function Section({ title, show = true, children }) {
  if (!show) return null;
  return (
    <section className="flex flex-wrap gap-x-10 gap-y-3 border-t border-neutral-200 py-9">
      <h2 className="basis-36 shrink-0 text-sm font-semibold text-neutral-500">{title}</h2>
      <div className="min-w-0 flex-1 basis-72 space-y-6">{children}</div>
    </section>
  );
}

export default function MinimalTemplate({ data }) {
  const d = prepare(data);
  return (
    <div className="bg-white text-neutral-900" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <header id="hero" className="flex flex-wrap items-center gap-6 pb-10">
          <Avatar src={d.image} name={d.name} className="h-24 w-24 shrink-0 rounded-full bg-neutral-100 text-2xl text-neutral-600" />
          <div className="min-w-0 flex-1 basis-60">
            <h1 className="break-words text-4xl font-bold tracking-tight">{d.name}</h1>
            {d.title && <p className="mt-1 text-lg text-neutral-600">{d.title}</p>}
            {d.objective && <p className="mt-4 max-w-xl text-neutral-700">{d.objective}</p>}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600">
              {d.links.map((l) => <Ext key={l.url} href={l.url} className="inline-flex items-center gap-1.5 hover:text-black hover:underline"><LinkIcon kind={l.kind} /> {l.label}</Ext>)}
            </div>
          </div>
        </header>

        <Section title="About" show={!!d.about}><p className="whitespace-pre-line leading-relaxed text-neutral-700">{d.about}</p></Section>

        <Section title="Education" show={d.education.length > 0}>
          {d.education.map((e) => (
            <div key={e._id || e.collegeName}>
              <p className="font-semibold">{e.collegeName}</p>
              <p className="text-neutral-700">{[e.degree, e.branch].filter(Boolean).join(', ')}</p>
              <p className="text-sm text-neutral-500">{[yearRange(e), e.grade].filter(Boolean).join('  |  ')}</p>
            </div>
          ))}
        </Section>

        <Section title="Skills" show={d.skillGroups.length > 0}>
          {d.skillGroups.map((g) => (
            <div key={g.category}>
              <p className="mb-2 text-sm font-medium text-neutral-500">{g.category}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span key={s._id || s.name} className="rounded-md border border-neutral-300 px-2.5 py-1 text-sm">{s.name}{s.level !== undefined && s.level !== null && <span className="ml-1.5 text-neutral-400">{s.level}%</span>}</span>
                ))}
              </div>
            </div>
          ))}
        </Section>

        <Section title="Projects" show={d.projects.length > 0}>
          {d.projects.map((pr) => (
            <article key={pr._id || pr.name}>
              {pr.image && <img src={assetUrl(pr.image)} alt={`${pr.name} screenshot`} className="mb-3 max-h-56 w-full rounded-lg border border-neutral-200 object-cover" />}
              <h3 className="font-semibold">{pr.name}</h3>
              {pr.description && <p className="mt-1 whitespace-pre-line text-neutral-700">{pr.description}</p>}
              {pr.technologies?.length > 0 && <p className="mt-2 text-sm text-neutral-500">{pr.technologies.join(', ')}</p>}
              <div className="mt-2 flex gap-4 text-sm">
                {pr.githubUrl && <Ext href={pr.githubUrl} className="inline-flex items-center gap-1 underline">Code <ExtIcon /></Ext>}
                {pr.liveUrl && <Ext href={pr.liveUrl} className="inline-flex items-center gap-1 underline">Live <ExtIcon /></Ext>}
              </div>
            </article>
          ))}
        </Section>

        <Section title="Experience" show={d.experience.length > 0}>
          {d.experience.map((x) => (
            <div key={x._id || x.role + x.organization}>
              <p className="font-semibold">{x.role}, {x.organization}</p>
              <p className="text-sm text-neutral-500">{formatRange(x.startDate, x.endDate)}</p>
              {x.description && <p className="mt-1 whitespace-pre-line text-neutral-700">{x.description}</p>}
            </div>
          ))}
        </Section>

        <Section title="Certifications" show={d.certifications.length > 0}>
          {d.certifications.map((c) => (
            <div key={c._id || c.name}>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-neutral-500">{[c.issuer, formatMonth(c.issueDate)].filter(Boolean).join(', ')}</p>
              {c.credentialUrl && <Ext href={c.credentialUrl} className="inline-flex items-center gap-1 text-sm underline">View credential <ExtIcon /></Ext>}
            </div>
          ))}
        </Section>

        <Section title="Achievements" show={d.achievements.length > 0}>
          {d.achievements.map((a) => (
            <div key={a._id || a.title}>
              <p className="font-semibold">{a.title}</p>
              {a.date && <p className="text-sm text-neutral-500">{formatMonth(a.date)}</p>}
              {a.description && <p className="mt-1 text-neutral-700">{a.description}</p>}
            </div>
          ))}
        </Section>

        <Section title="More" show={d.languages.length + d.interests.length + d.hobbies.length > 0}>
          {d.languages.length > 0 && <p><span className="font-medium">Languages:</span> {d.languages.join(', ')}</p>}
          {d.interests.length > 0 && <p><span className="font-medium">Interests:</span> {d.interests.join(', ')}</p>}
          {d.hobbies.length > 0 && <p><span className="font-medium">Hobbies:</span> {d.hobbies.join(', ')}</p>}
        </Section>

        <Section title="Contact" show={d.contact.length > 0}>
          <ul className="space-y-2">
            {d.contact.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-neutral-700"><ContactIcon kind={c.kind} />{c.href ? <a href={c.href} className="hover:underline">{c.label}</a> : c.label}</li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
