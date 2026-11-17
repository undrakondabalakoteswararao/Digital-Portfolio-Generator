import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import api from '../services/api';
import TemplateRenderer from '../components/portfolio/TemplateRenderer';
import { FullPageLoader } from '../components/common/Loader';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { downloadResume } from '../utils/resume';
import { getErrorMessage } from '../utils/errors';

export default function PublicPortfolio() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    setState({ loading: true });
    api.get(`/portfolio/public/${slug}`)
      .then((r) => setState({ data: r.data }))
      .catch((e) => setState({ notFound: e.response?.status === 404, error: getErrorMessage(e) }));
  }, [slug]);

  const { data } = state;
  useDocumentMeta({
    title: data ? `${data.user.name}${data.profile.professionalTitle ? ` - ${data.profile.professionalTitle}` : ''} | Portfolio` : state.loading ? 'Loading portfolio...' : 'Portfolio not available',
    description: data ? (data.profile.careerObjective || data.profile.about || `Portfolio of ${data.user.name}`).slice(0, 160) : undefined,
  });

  if (state.loading) return <FullPageLoader label="Loading portfolio..." />;
  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <p className="text-5xl font-extrabold text-brand">{state.notFound ? '404' : 'Oops'}</p>
          <h1 className="mt-3 text-2xl font-bold">{state.notFound ? 'Portfolio not available' : 'Could not load this portfolio'}</h1>
          <p className="mt-2 max-w-md text-muted">{state.error}</p>
          <Link to="/" className="btn btn-primary mt-6">Go to PortfolioForge</Link>
        </div>
      </div>
    );
  }

  const payload = { name: data.user.name, profile: data.profile };
  return (
    <>
      <TemplateRenderer template={data.template} data={payload} />
      <button onClick={() => downloadResume(payload)} className="btn btn-primary fixed bottom-5 right-5 shadow-lg"><Download size={16} /> Resume</button>
    </>
  );
}
