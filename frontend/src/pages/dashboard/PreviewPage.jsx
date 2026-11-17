import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Download, Eye, EyeOff, Monitor, Palette, Pencil, Share2, Smartphone, Tablet, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../../context/ProfileContext';
import PageHeader from '../../components/dashboard/PageHeader';
import TemplateRenderer from '../../components/portfolio/TemplateRenderer';
import { Spinner } from '../../components/common/Loader';
import { downloadResume } from '../../utils/resume';
import { publicUrl } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';

const SIZES = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: 768 },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: 390 },
];

export default function PreviewPage() {
  const { profile, name, portfolio, publish, unpublish, updateSlug } = useProfile();
  const [size, setSize] = useState('desktop');
  const [busy, setBusy] = useState(false);
  const [slug, setSlug] = useState(portfolio.slug);
  const [savingSlug, setSavingSlug] = useState(false);
  const url = publicUrl(portfolio.slug);

  const togglePublish = async () => {
    setBusy(true);
    try {
      if (portfolio.isPublished) { await unpublish(); toast.success('Portfolio unpublished. The link is now private.'); }
      else { await publish(); toast.success('Portfolio published!'); }
    } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(portfolio.isPublished ? 'Link copied' : 'Link copied. Publish your portfolio so others can open it.');
    } catch { toast.error('Could not copy. Select the link and copy it manually.'); }
  };

  const share = async () => {
    if (!portfolio.isPublished) return toast.error('Publish your portfolio first so the link works for others.');
    if (navigator.share) {
      try { await navigator.share({ title: `${name} - Portfolio`, url }); } catch { /* cancelled */ }
    } else copy();
  };

  const saveSlug = async () => {
    if (slug === portfolio.slug) return;
    setSavingSlug(true);
    try { await updateSlug(slug); toast.success('Portfolio link updated'); } catch (e) { toast.error(getErrorMessage(e)); setSlug(portfolio.slug); } finally { setSavingSlug(false); }
  };

  const width = SIZES.find((s) => s.id === size).width;

  return (
    <div>
      <PageHeader
        title="Portfolio preview"
        description="This is a live view of your real data. Edit anything and come back - it updates instantly."
        actions={
          <>
            <Link to="/dashboard/profile" className="btn btn-outline"><Pencil size={16} /> Edit portfolio</Link>
            <Link to="/dashboard/templates" className="btn btn-outline"><Palette size={16} /> Change template</Link>
            <button className="btn btn-outline" onClick={() => downloadResume({ name, profile })}><Download size={16} /> Download resume</button>
            <button className="btn btn-outline" onClick={share}><Share2 size={16} /> Share</button>
            <button className="btn btn-primary" onClick={togglePublish} disabled={busy}>
              {busy ? <Spinner /> : portfolio.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
              {portfolio.isPublished ? 'Unpublish' : 'Publish portfolio'}
            </button>
          </>
        }
      />

      <div className="card mb-4 flex flex-wrap items-end gap-4 p-4">
        <div className="min-w-0 flex-1 basis-72">
          <p className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            Public link
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${portfolio.isPublished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-brand-soft text-muted'}`}>{portfolio.isPublished ? 'Published' : 'Draft'}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">{window.location.origin}/portfolio/</span>
            <input className="input !w-48" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} aria-label="Portfolio link name" />
            <button className="btn btn-outline" onClick={saveSlug} disabled={savingSlug || slug === portfolio.slug}>{savingSlug ? <Spinner /> : <Check size={16} />} Save link</button>
            <button className="btn btn-outline" onClick={copy}><Copy size={16} /> Copy link</button>
          </div>
        </div>
        <div className="flex gap-1 rounded-lg border border-line p-1" role="group" aria-label="Preview size">
          {SIZES.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSize(id)} aria-pressed={size === id} title={label} className={`rounded-md p-2 ${size === id ? 'bg-brand text-brand-fg' : 'text-muted hover:text-ink'}`}><Icon size={18} /></button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-brand-soft p-3 sm:p-6">
        <div className="mx-auto max-w-full overflow-hidden rounded-xl shadow-lg transition-all duration-300" style={{ width }}>
          <TemplateRenderer template={portfolio.selectedTemplate} data={{ name, profile }} />
        </div>
      </div>
    </div>
  );
}
