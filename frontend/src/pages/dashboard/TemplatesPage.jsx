import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useProfile } from '../../context/ProfileContext';
import PageHeader from '../../components/dashboard/PageHeader';
import TemplatePreviewThumb from '../../components/portfolio/TemplatePreviewThumb';
import { Spinner } from '../../components/common/Loader';
import { getErrorMessage } from '../../utils/errors';

export default function TemplatesPage() {
  const { profile, name, portfolio, selectTemplate } = useProfile();
  const [templates, setTemplates] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/templates').then((r) => setTemplates(r.data.templates)).catch((e) => setError(getErrorMessage(e)));
  }, []);

  const choose = async (id) => {
    setBusy(id);
    try { await selectTemplate(id); toast.success('Template updated'); } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(''); }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!templates) return <div className="flex items-center gap-2 text-muted"><Spinner /> Loading templates...</div>;

  return (
    <div>
      <PageHeader
        title="Choose a template"
        description="Each preview below uses your own information. You can switch at any time."
        actions={<Link to="/dashboard/preview" className="btn btn-outline">Open full preview</Link>}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {templates.map((t) => {
          const selected = portfolio.selectedTemplate === t.id;
          return (
            <article key={t.id} className={`card overflow-hidden transition ${selected ? 'ring-2 ring-brand' : ''}`}>
              <TemplatePreviewThumb template={t.id} data={{ name, profile }} height={260} />
              <div className="flex items-center justify-between gap-4 border-t border-line p-5">
                <div>
                  <h2 className="font-bold">{t.name}</h2>
                  <p className="text-sm text-muted">{t.description}</p>
                  <p className="mt-1 text-xs text-muted">Best for: {t.bestFor}</p>
                </div>
                <button className={`btn shrink-0 ${selected ? 'btn-outline' : 'btn-primary'}`} disabled={selected || !!busy} onClick={() => choose(t.id)}>
                  {busy === t.id ? <Spinner /> : selected ? <Check size={16} /> : null} {selected ? 'Selected' : 'Use this'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
