import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, FileText, Globe, Layers, LockKeyhole, Palette, Rocket, Smartphone, Sparkles, UserPlus, PenLine, Mail } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import useDocumentMeta from '../hooks/useDocumentMeta';

const FEATURES = [
  [Sparkles, 'Automatic portfolio', 'Fill in your details once and your portfolio page is generated for you. No HTML or CSS.'],
  [Layers, 'Four templates', 'Switch between minimal, developer, creative and corporate looks without re-entering anything.'],
  [Globe, 'Shareable link', 'Publish to a public URL such as /portfolio/your-name and put it on your resume or LinkedIn.'],
  [FileText, 'PDF resume', 'Download a clean one-page-style resume built from the same information.'],
  [Smartphone, 'Works on every screen', 'Portfolios are responsive, so recruiters can open them on a phone or a laptop.'],
  [LockKeyhole, 'You stay in control', 'Your portfolio is private until you publish it, and you can unpublish at any time.'],
];
const STEPS = [
  [UserPlus, 'Create an account', 'Sign up with your name and email.'],
  [PenLine, 'Add your details', 'Education, skills, projects, internships, certificates and achievements.'],
  [Palette, 'Pick a template', 'Preview each design with your own content and choose one.'],
  [Rocket, 'Publish and share', 'Get a public link and a PDF resume to send to recruiters.'],
];
const BENEFITS = [
  'Look professional even without a work history',
  'Put your projects in front of recruiters, not just a list of skills',
  'Save hours compared with building a site from scratch',
  'Keep one source of truth for your portfolio and resume',
];
const FAQ = [
  ['Do I need to know programming?', 'No. You fill in forms and PortfolioForge builds the page for you.'],
  ['Is my portfolio public by default?', 'No. It stays private until you click Publish. You can unpublish whenever you like.'],
  ['Can I change my template later?', 'Yes. Your content is stored separately, so you can switch templates at any time.'],
  ['Can I download my resume?', 'Yes. The resume PDF uses the details you entered and nothing else.'],
  ['Who can edit my portfolio?', 'Only you, after logging in. Visitors can only view a published portfolio.'],
];

const MOCKS = [
  ['Minimal Professional', 'bg-white', 'bg-neutral-300', 'bg-neutral-200', 'For freshers and job applications'],
  ['Modern Developer', 'bg-slate-900', 'bg-cyan-400', 'bg-slate-700', 'For software developers'],
  ['Creative Portfolio', 'bg-amber-100', 'bg-rose-500', 'bg-teal-400', 'For designers and creatives'],
  ['Corporate Professional', 'bg-slate-100', 'bg-slate-800', 'bg-slate-300', 'For corporate applications'],
];

function Hero() {
  const { user } = useAuth();
  return (
    <section id="home" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand"><Sparkles size={14} /> For students and freshers</p>
        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">Build Your Professional Portfolio. Showcase Your Potential.</h1>
        <p className="mt-5 max-w-xl text-lg text-muted">PortfolioForge turns your education, skills and projects into a polished portfolio website and PDF resume. No coding or design skills needed, and one link to share with recruiters.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary !px-6 !py-3">Get Started <ArrowRight size={16} /></Link>
          <a href="#templates" className="btn btn-outline !px-6 !py-3">Explore Templates</a>
        </div>
      </div>
      <div className="card overflow-hidden shadow-xl" aria-hidden="true">
        <div className="flex items-center gap-2 border-b border-line bg-brand-soft px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 flex-1 truncate rounded-md bg-surface px-3 py-1 text-xs text-muted">portfolioforge.app/portfolio/your-name</span>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4"><div className="h-14 w-14 rounded-full bg-brand" /><div className="flex-1 space-y-2"><div className="h-4 w-2/3 rounded bg-ink/80" /><div className="h-3 w-1/3 rounded bg-muted/50" /></div></div>
          <div className="space-y-2"><div className="h-3 rounded bg-muted/30" /><div className="h-3 w-5/6 rounded bg-muted/30" /></div>
          <div className="flex flex-wrap gap-2">{[16, 20, 14, 18, 12].map((w, i) => <div key={i} className="h-6 rounded-full bg-brand-soft" style={{ width: `${w * 4}px` }} />)}</div>
          <div className="grid grid-cols-2 gap-3">{[0, 1].map((i) => <div key={i} className="rounded-xl border border-line p-3"><div className="mb-2 h-16 rounded-lg bg-brand-soft" /><div className="h-3 w-2/3 rounded bg-ink/70" /></div>)}</div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-3">
      {FAQ.map(([q, a], i) => (
        <div key={q} className="card">
          <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {q}<ChevronDown size={18} className={`shrink-0 transition ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <p className="px-5 pb-4 text-sm text-muted">{a}</p>}
        </div>
      ))}
    </div>
  );
}

const Heading = ({ title, text }) => (
  <div className="mx-auto max-w-2xl text-center">
    <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
    {text && <p className="mt-3 text-muted">{text}</p>}
  </div>
);

export default function Landing() {
  useDocumentMeta({ title: 'PortfolioForge - Build Your Professional Portfolio', description: 'Create a professional portfolio website and PDF resume without coding. Built for students and freshers.' });
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section id="features" className="border-y border-line bg-surface py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Heading title="Everything you need to get noticed" text="One place to collect your work and present it well." />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(([Icon, t, d]) => (
                <div key={t} className="card p-6">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand"><Icon size={20} /></div>
                  <h3 className="font-bold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-6 py-20">
          <Heading title="How it works" text="From sign-up to a shareable portfolio in four steps." />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([Icon, t, d], i) => (
              <li key={t} className="card p-6">
                <div className="mb-4 flex items-center justify-between"><div className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-brand-fg"><Icon size={20} /></div><span className="text-3xl font-extrabold text-line">0{i + 1}</span></div>
                <h3 className="font-bold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="templates" className="border-y border-line bg-surface py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Heading title="Four templates, your content" text="Every template shows your own details. Switch whenever you want." />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MOCKS.map(([name, bg, a, b, note]) => (
                <div key={name} className="card overflow-hidden">
                  <div className={`${bg} space-y-2.5 p-5`} aria-hidden="true">
                    <div className={`h-3 w-1/2 rounded ${a}`} /><div className={`h-2 w-3/4 rounded ${b}`} /><div className={`h-2 w-2/3 rounded ${b}`} />
                    <div className="grid grid-cols-2 gap-2 pt-2"><div className={`h-14 rounded ${b}`} /><div className={`h-14 rounded ${b}`} /></div>
                    <div className="flex gap-1.5 pt-1"><div className={`h-4 w-10 rounded-full ${a}`} /><div className={`h-4 w-8 rounded-full ${a}`} /></div>
                  </div>
                  <div className="p-4"><h3 className="font-bold">{name}</h3><p className="text-sm text-muted">{note}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center"><Link to="/register" className="btn btn-primary">Try them with your details</Link></div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Built for students and freshers</h2>
            <p className="mt-4 text-muted">PortfolioForge started as a Web Technology course project with a simple idea: a student with good projects should not need to learn web design to show them off. Everything is built with React, Node.js, Express and MongoDB.</p>
          </div>
          <ul className="space-y-3">
            {BENEFITS.map((b) => <li key={b} className="card flex items-start gap-3 p-4 text-sm"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-xs text-brand-fg">&#10003;</span>{b}</li>)}
          </ul>
        </section>

        <section id="faq" className="border-t border-line bg-surface py-20">
          <div className="mx-auto max-w-6xl px-6"><Heading title="Frequently asked questions" /><Faq /></div>
        </section>

        <section id="contact" className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Heading title="Questions or feedback?" text="We would love to hear from you." />
          <a href="mailto:hello@portfolioforge.example" className="btn btn-outline mt-6"><Mail size={16} /> hello@portfolioforge.example</a>
        </section>
      </main>
      <Footer />
    </>
  );
}
