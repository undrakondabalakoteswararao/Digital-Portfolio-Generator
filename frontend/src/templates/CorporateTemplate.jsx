import { prepare, LinkIcon, ContactIcon, Ext, ExtIcon, Avatar } from './shared';
import { formatRange, formatMonth, yearRange } from '../utils/format';

function Block({ title, show = true, children }) {
  if (!show) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 border-b-2 border-slate-800 pb-1 text-sm font-bold uppercase tracking-wider text-slate-800">{title}</h2>
      {children}
    </section>
  );
}

export default function CorporateTemplate({ data }) {
  const d = prepare(data);
  const summary = d.objective || d.about;
  return (
    <div className="bg-slate-100 text-slate-800" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="bg-slate-900 px-6 py-10 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-6">
          <Avatar src={d.image} name={d.name} className="h-24 w-24 shrink-0 rounded-md border border-slate-600 bg-slate-700 text-2xl text-white" />
          <div className="min-w-0 flex-1 basis-60">
            <h1 className="break-words text-4xl font-bold">{d.name}</h1>
            {d.title && <p className="mt-1 text-lg text-slate-300">{d.title}</p>}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-wrap gap-10 px-6 py-10">
        <aside className="min-w-0 flex-[1_1_220px]">
          <Block title="Contact" show={d.contact.length > 0}>
            <ul className="space-y-2 text-sm">
              {d.contact.map((c) => <li key={c.label} className="flex items-start gap-2 break-all"><span className="mt-0.5"><ContactIcon kind={c.kind} /></span>{c.href ? <a href={c.href} className="hover:underline">{c.label}</a> : c.label}</li>)}
            </ul>
          </Block>
          <Block title="Links" show={d.links.length > 0}>
            <ul className="space-y-2 text-sm">
              {d.links.map((l) => <li key={l.url}><Ext href={l.url} className="inline-flex items-center gap-2 hover:underline"><LinkIcon kind={l.kind} /> {l.label}</Ext></li>)}
            </ul>
          </Block>
          <Block title="Skills" show={d.skillGroups.length > 0}>
            <div className="space-y-3 text-sm">
              {d.skillGroups.map((g) => (
                <div key={g.category}>
                  <p className="font-bold">{g.category}</p>
                  <p>{g.items.map((s) => (s.level !== undefined && s.level !== null ? `${s.name} (${s.level}%)` : s.name)).join(', ')}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title="Languages" show={d.languages.length > 0}><p className="text-sm">{d.languages.join(', ')}</p></Block>
        </aside>

        <main className="min-w-0 flex-[3_1_380px]">
          <Block title="Professional summary" show={!!summary}>
            {d.objective && <p className="leading-relaxed">{d.objective}</p>}
            {d.about && d.objective && <p className="mt-3 whitespace-pre-line leading-relaxed">{d.about}</p>}
            {d.about && !d.objective && <p className="whitespace-pre-line leading-relaxed">{d.about}</p>}
          </Block>

          <Block title="Experience" show={d.experience.length > 0}>
            <div className="space-y-5">
              {d.experience.map((x) => (
                <div key={x._id || x.role + x.organization}>
                  <div className="flex flex-wrap justify-between gap-x-4"><p className="font-bold">{x.role}</p><p className="text-sm text-slate-500">{formatRange(x.startDate, x.endDate)}</p></div>
                  <p className="italic">{x.organization}</p>
                  {x.description && <p className="mt-1 whitespace-pre-line text-sm">{x.description}</p>}
                </div>
              ))}
            </div>
          </Block>

          <Block title="Education" show={d.education.length > 0}>
            <div className="space-y-4">
              {d.education.map((e) => (
                <div key={e._id || e.collegeName}>
                  <div className="flex flex-wrap justify-between gap-x-4"><p className="font-bold">{e.collegeName}</p><p className="text-sm text-slate-500">{yearRange(e)}</p></div>
                  <p>{[e.degree, e.branch].filter(Boolean).join(', ')}</p>
                  {e.grade && <p className="text-sm text-slate-500">{e.grade}</p>}
                </div>
              ))}
            </div>
          </Block>

          <Block title="Projects" show={d.projects.length > 0}>
            <div className="space-y-5">
              {d.projects.map((pr) => (
                <div key={pr._id || pr.name}>
                  <p className="font-bold">{pr.name}</p>
                  {pr.description && <p className="mt-1 whitespace-pre-line text-sm">{pr.description}</p>}
                  {pr.technologies?.length > 0 && <p className="mt-1 text-sm text-slate-500"><span className="font-semibold">Technologies:</span> {pr.technologies.join(', ')}</p>}
                  <div className="mt-1 flex gap-4 text-sm">
                    {pr.githubUrl && <Ext href={pr.githubUrl} className="inline-flex items-center gap-1 underline">Repository <ExtIcon /></Ext>}
                    {pr.liveUrl && <Ext href={pr.liveUrl} className="inline-flex items-center gap-1 underline">Live project <ExtIcon /></Ext>}
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Certifications" show={d.certifications.length > 0}>
            <ul className="space-y-2 text-sm">
              {d.certifications.map((c) => <li key={c._id || c.name}><span className="font-bold">{c.name}</span>{[c.issuer, formatMonth(c.issueDate)].filter(Boolean).length > 0 && `, ${[c.issuer, formatMonth(c.issueDate)].filter(Boolean).join(', ')}`}{c.credentialUrl && <Ext href={c.credentialUrl} className="ml-2 underline">View</Ext>}</li>)}
            </ul>
          </Block>

          <Block title="Achievements" show={d.achievements.length > 0}>
            <ul className="space-y-2 text-sm">
              {d.achievements.map((a) => <li key={a._id || a.title}><span className="font-bold">{a.title}</span>{a.date && ` (${formatMonth(a.date)})`}{a.description && <p>{a.description}</p>}</li>)}
            </ul>
          </Block>

          <Block title="Interests" show={d.interests.length + d.hobbies.length > 0}>
            <p className="text-sm">{[...d.interests, ...d.hobbies].join(', ')}</p>
          </Block>
        </main>
      </div>
    </div>
  );
}
