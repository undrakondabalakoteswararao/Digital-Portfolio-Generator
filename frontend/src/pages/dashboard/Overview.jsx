import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Wrench, FolderGit2, Globe, Pencil, Rocket, ExternalLink, Activity } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../services/api';
import { useProfile } from '../../context/ProfileContext';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import TemplatePreviewThumb from '../../components/portfolio/TemplatePreviewThumb';
import { FullPageLoader } from '../../components/common/Loader';
import { getErrorMessage } from '../../utils/errors';
import { timeAgo } from '../../utils/format';
import useDocumentMeta from '../../hooks/useDocumentMeta';

export default function Overview() {
  useDocumentMeta({ title: 'Dashboard - PortfolioForge' });
  const { profile, name, portfolio } = useProfile();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data)).catch((e) => setError(getErrorMessage(e)));
  }, [profile, portfolio]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return <FullPageLoader label="Loading overview..." />;

  const { counts, completion, recentActivity } = stats;
  const chart = [
    ['Education', counts.education], ['Skills', counts.skills], ['Projects', counts.projects],
    ['Experience', counts.experience], ['Certs', counts.certifications], ['Awards', counts.achievements],
  ].map(([label, count]) => ({ label, count }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${name.split(' ')[0]}`}
        description="Here is where your portfolio stands."
        actions={
          <>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard/profile')}><Pencil size={16} /> Edit profile</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard/templates')}><Rocket size={16} /> Create portfolio</button>
            {stats.portfolio.isPublished ? (
              <a className="btn btn-outline" href={`/portfolio/${stats.portfolio.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> View public portfolio</a>
            ) : (
              <button className="btn btn-outline" onClick={() => navigate('/dashboard/preview')} title="Publish first to get a public link"><ExternalLink size={16} /> View public portfolio</button>
            )}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderGit2} label="Projects added" value={counts.projects} />
        <StatCard icon={Wrench} label="Skills added" value={counts.skills} />
        <StatCard icon={Award} label="Certifications" value={counts.certifications} />
        <StatCard icon={Globe} label="Portfolio status" value={stats.portfolio.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="flex items-end justify-between">
            <h2 className="font-semibold">Profile completion</h2>
            <p className="text-3xl font-extrabold text-brand">{completion.percentage}%</p>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-brand-soft" role="progressbar" aria-valuenow={completion.percentage} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${completion.percentage}%` }} />
          </div>
          {completion.missing.length > 0 ? (
            <p className="mt-3 text-sm text-muted">Still missing: {completion.missing.join(', ')}.</p>
          ) : (
            <p className="mt-3 text-sm text-muted">Your profile is complete.</p>
          )}
          <div className="mt-6 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b855" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#6366f122' }} contentStyle={{ borderRadius: 8, border: '1px solid #94a3b855' }} />
                <Bar dataKey="count" name="Entries" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card overflow-hidden">
          <Link to="/dashboard/preview" className="block border-b border-line">
            <TemplatePreviewThumb template={portfolio.selectedTemplate} data={{ name, profile }} height={190} />
          </Link>
          <div className="p-5">
            <h2 className="font-semibold">Portfolio preview</h2>
            <p className="mt-1 text-sm text-muted">Template: <span className="capitalize">{portfolio.selectedTemplate}</span></p>
            <Link to="/dashboard/preview" className="btn btn-outline mt-4 w-full">Open live preview</Link>
          </div>
        </section>
      </div>

      <section className="card p-5">
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><Activity size={18} /> Recent activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted">Nothing yet. Updates to your profile will show here.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recentActivity.map((a, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-2.5 text-sm"><span>{a.message}</span><span className="shrink-0 text-muted">{timeAgo(a.at)}</span></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
