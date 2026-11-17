import { prepare, LinkIcon, ContactIcon, Ext, ExtIcon, Avatar } from './shared';
import { formatRange, formatMonth, yearRange, assetUrl } from '../utils/format';

function Section({ id, title, show = true, children }) {
  if (!show) return null;
  return (
    <section id={id} className="py-10">
      <h2 className="mb-6 font-mono text-lg font-semibold text-cyan-400"><span className="text-slate-500">{'// '}</span>{title}</h2>
      {children}
    </section>
  );
}

export default function ModernTemplate({ data }) {
  const d = prepare(data);
  const grid = 'grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4';
  return (
    <div className="bg-slate-950 text-slate-200" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <header className="flex flex-wrap items-center gap-8 pb-6">
          <Avatar src={d.image} name={d.name} className="h-28 w-28 shrink-0 rounded-2xl border border-slate-700 bg-slate-900 text-3xl text-cyan-300" />
          <div className="min-w-0 flex-1 basis-72">
            <p className="font-mono text-sm text-cyan-400">hello, I am</p>
            <h1 className="mt-1 break-words text-4xl font-extrabold text-white sm:text-5xl">{d.name}</h1>
            {d.title && <p className="mt-2 font-mono text-lg text-slate-400">{d.title}</p>}
            {d.objective && <p className="mt-4 max-w-2xl text-slate-300">{d.objective}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              {d.links.map((l) => <Ext key={l.url} href={l.url} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:border-cyan-400 hover:text-cyan-300"><LinkIcon kind={l.kind} /> {l.label}</Ext>)}
            </div>
          </div>
        </header>

        <Section id="about" title="about" show={!!d.about}><p className="max-w-3xl whitespace-pre-line leading-relaxed text-slate-300">{d.about}</p></Section>

        <Section id="skills" title="skills" show={d.skillGroups.length > 0}>
          <div className={grid}>
            {d.skillGroups.map((g) => (
              <div key={g.category} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <p className="mb-3 font-mono text-xs text-slate-500">{g.category}</p>
                <div className="space-y-2.5">
                  {g.items.map((s) => (
                    <div key={s._id || s.name}>
                      <div className="flex justify-between text-sm"><span>{s.name}</span>{s.level !== undefined && s.level !== null && <span className="text-slate-500">{s.level}%</span>}</div>
                      {s.level !== undefined && s.level !== null && <div className="mt-1 h-1.5 rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${s.level}%` }} /></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" title="projects" show={d.projects.length > 0}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            {d.projects.map((pr) => (
              <article key={pr._id || pr.name} className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                {pr.image && <img src={assetUrl(pr.image)} alt={`${pr.name} screenshot`} className="h-40 w-full object-cover" />}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-white">{pr.name}</h3>
                  {pr.description && <p className="mt-2 flex-1 whitespace-pre-line text-sm text-slate-400">{pr.description}</p>}
                  {pr.technologies?.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{pr.technologies.map((t) => <span key={t} className="rounded bg-cyan-400/10 px-2 py-0.5 font-mono text-xs text-cyan-300">{t}</span>)}</div>}
                  <div className="mt-4 flex gap-4 text-sm">
                    {pr.githubUrl && <Ext href={pr.githubUrl} className="inline-flex items-center gap-1.5 text-cyan-300 hover:underline"><LinkIcon kind="github" size={14} /> Code</Ext>}
                    {pr.liveUrl && <Ext href={pr.liveUrl} className="inline-flex items-center gap-1.5 text-cyan-300 hover:underline"><ExtIcon /> Live demo</Ext>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="experience" title="experience" show={d.experience.length > 0}>
          <div className="space-y-6 border-l border-slate-700 pl-6">
            {d.experience.map((x) => (
              <div key={x._id || x.role + x.organization} className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <p className="font-semibold text-white">{x.role} <span className="font-normal text-slate-400">at {x.organization}</span></p>
                <p className="font-mono text-xs text-slate-500">{formatRange(x.startDate, x.endDate)}</p>
                {x.description && <p className="mt-2 whitespace-pre-line text-sm text-slate-400">{x.description}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section id="education" title="education" show={d.education.length > 0}>
          <div className={grid}>
            {d.education.map((e) => (
              <div key={e._id || e.collegeName} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <p className="font-semibold text-white">{e.collegeName}</p>
                <p className="text-sm text-slate-300">{[e.degree, e.branch].filter(Boolean).join(', ')}</p>
                <p className="mt-1 font-mono text-xs text-slate-500">{[yearRange(e), e.grade].filter(Boolean).join('  |  ')}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="certifications" title="certifications" show={d.certifications.length > 0}>
          <ul className="space-y-3">
            {d.certifications.map((c) => (
              <li key={c._id || c.name} className="text-sm"><span className="font-semibold text-white">{c.name}</span> <span className="text-slate-400">{[c.issuer, formatMonth(c.issueDate)].filter(Boolean).join(', ')}</span>{c.credentialUrl && <Ext href={c.credentialUrl} className="ml-2 text-cyan-300 hover:underline">credential</Ext>}</li>
            ))}
          </ul>
        </Section>

        <Section id="achievements" title="achievements" show={d.achievements.length > 0}>
          <ul className="space-y-3">
            {d.achievements.map((a) => (
              <li key={a._id || a.title} className="text-sm"><span className="font-semibold text-white">{a.title}</span>{a.date && <span className="ml-2 font-mono text-xs text-slate-500">{formatMonth(a.date)}</span>}{a.description && <p className="text-slate-400">{a.description}</p>}</li>
            ))}
          </ul>
        </Section>

        <Section id="more" title="more" show={d.languages.length + d.interests.length + d.hobbies.length > 0}>
          <div className="space-y-1 text-sm text-slate-300">
            {d.languages.length > 0 && <p><span className="text-slate-500">languages:</span> {d.languages.join(', ')}</p>}
            {d.interests.length > 0 && <p><span className="text-slate-500">interests:</span> {d.interests.join(', ')}</p>}
            {d.hobbies.length > 0 && <p><span className="text-slate-500">hobbies:</span> {d.hobbies.join(', ')}</p>}
          </div>
        </Section>

        <Section id="contact" title="contact" show={d.contact.length > 0}>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {d.contact.map((c) => <li key={c.label} className="flex items-center gap-2"><ContactIcon kind={c.kind} />{c.href ? <a href={c.href} className="hover:text-cyan-300">{c.label}</a> : c.label}</li>)}
          </ul>
        </Section>
      </div>
    </div>
  );
}
