import { prepare, LinkIcon, ContactIcon, Ext, ExtIcon, Avatar } from './shared';
import { formatRange, formatMonth, yearRange, assetUrl } from '../utils/format';

const COLORS = [
  { bar: 'bg-rose-500', chip: 'bg-rose-100 text-rose-700' },
  { bar: 'bg-amber-400', chip: 'bg-amber-100 text-amber-800' },
  { bar: 'bg-teal-500', chip: 'bg-teal-100 text-teal-800' },
  { bar: 'bg-violet-500', chip: 'bg-violet-100 text-violet-700' },
];

function Section({ title, show = true, children }) {
  if (!show) return null;
  return (
    <section className="py-10">
      <h2 className="mb-6 inline-block -rotate-1 bg-neutral-900 px-4 py-1.5 text-xl font-extrabold text-amber-300">{title}</h2>
      {children}
    </section>
  );
}

export default function CreativeTemplate({ data }) {
  const d = prepare(data);
  return (
    <div className="bg-amber-50 text-neutral-900" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      <header className="bg-rose-500 px-6 py-14 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-8">
          <Avatar src={d.image} name={d.name} className="h-32 w-32 shrink-0 rotate-3 rounded-3xl border-4 border-white bg-amber-300 text-4xl text-neutral-900" />
          <div className="min-w-0 flex-1 basis-72">
            <h1 className="break-words text-5xl font-extrabold leading-tight">{d.name}</h1>
            {d.title && <p className="mt-2 text-xl font-semibold text-amber-200">{d.title}</p>}
            {d.objective && <p className="mt-4 max-w-2xl text-rose-50">{d.objective}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              {d.links.map((l) => <Ext key={l.url} href={l.url} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-rose-600 hover:bg-amber-200"><LinkIcon kind={l.kind} /> {l.label}</Ext>)}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-14">
        <Section title="About me" show={!!d.about}><p className="max-w-3xl whitespace-pre-line text-lg leading-relaxed">{d.about}</p></Section>

        <Section title="Projects" show={d.projects.length > 0}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {d.projects.map((pr, i) => {
              const c = COLORS[i % COLORS.length];
              return (
                <article key={pr._id || pr.name} className="flex flex-col overflow-hidden rounded-2xl border-2 border-neutral-900 bg-white shadow-[5px_5px_0_#171717]">
                  <div className={`h-3 ${c.bar}`} />
                  {pr.image && <img src={assetUrl(pr.image)} alt={`${pr.name} screenshot`} className="h-44 w-full border-b-2 border-neutral-900 object-cover" />}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-extrabold">{pr.name}</h3>
                    {pr.description && <p className="mt-2 flex-1 whitespace-pre-line text-sm text-neutral-700">{pr.description}</p>}
                    {pr.technologies?.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{pr.technologies.map((t) => <span key={t} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.chip}`}>{t}</span>)}</div>}
                    <div className="mt-4 flex gap-4 text-sm font-semibold">
                      {pr.githubUrl && <Ext href={pr.githubUrl} className="inline-flex items-center gap-1 underline">Code <ExtIcon /></Ext>}
                      {pr.liveUrl && <Ext href={pr.liveUrl} className="inline-flex items-center gap-1 underline">Live <ExtIcon /></Ext>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <Section title="Skills" show={d.skillGroups.length > 0}>
          <div className="space-y-5">
            {d.skillGroups.map((g, gi) => (
              <div key={g.category}>
                <p className="mb-2 text-sm font-bold">{g.category}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((s, i) => <span key={s._id || s.name} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${COLORS[(gi + i) % COLORS.length].chip}`}>{s.name}{s.level !== undefined && s.level !== null && ` · ${s.level}%`}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Experience" show={d.experience.length > 0}>
          <div className="space-y-4">
            {d.experience.map((x) => (
              <div key={x._id || x.role + x.organization} className="rounded-2xl border-2 border-neutral-900 bg-white p-5">
                <p className="text-lg font-extrabold">{x.role}</p>
                <p className="font-semibold text-rose-600">{x.organization}</p>
                <p className="text-sm text-neutral-500">{formatRange(x.startDate, x.endDate)}</p>
                {x.description && <p className="mt-2 whitespace-pre-line text-neutral-700">{x.description}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Education" show={d.education.length > 0}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {d.education.map((e) => (
              <div key={e._id || e.collegeName} className="rounded-2xl bg-teal-100 p-5">
                <p className="font-extrabold">{e.collegeName}</p>
                <p>{[e.degree, e.branch].filter(Boolean).join(', ')}</p>
                <p className="text-sm text-neutral-600">{[yearRange(e), e.grade].filter(Boolean).join('  |  ')}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Certifications" show={d.certifications.length > 0}>
          <ul className="space-y-2">
            {d.certifications.map((c) => <li key={c._id || c.name}><span className="font-bold">{c.name}</span> <span className="text-neutral-600">{[c.issuer, formatMonth(c.issueDate)].filter(Boolean).join(', ')}</span>{c.credentialUrl && <Ext href={c.credentialUrl} className="ml-2 font-semibold text-rose-600 underline">credential</Ext>}</li>)}
          </ul>
        </Section>

        <Section title="Achievements" show={d.achievements.length > 0}>
          <ul className="space-y-3">
            {d.achievements.map((a) => <li key={a._id || a.title}><span className="font-bold">{a.title}</span>{a.date && <span className="ml-2 text-sm text-neutral-500">{formatMonth(a.date)}</span>}{a.description && <p className="text-neutral-700">{a.description}</p>}</li>)}
          </ul>
        </Section>

        <Section title="Beyond work" show={d.languages.length + d.interests.length + d.hobbies.length > 0}>
          <div className="space-y-1">
            {d.languages.length > 0 && <p><b>Languages:</b> {d.languages.join(', ')}</p>}
            {d.interests.length > 0 && <p><b>Interests:</b> {d.interests.join(', ')}</p>}
            {d.hobbies.length > 0 && <p><b>Hobbies:</b> {d.hobbies.join(', ')}</p>}
          </div>
        </Section>

        <Section title="Say hello" show={d.contact.length > 0}>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-semibold">
            {d.contact.map((c) => <li key={c.label} className="flex items-center gap-2"><ContactIcon kind={c.kind} />{c.href ? <a href={c.href} className="underline">{c.label}</a> : c.label}</li>)}
          </ul>
        </Section>
      </div>
    </div>
  );
}
