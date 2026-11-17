import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta({ title: 'Page not found - PortfolioForge' });
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-3 text-2xl font-bold">This page does not exist</h1>
        <p className="mt-2 text-muted">Check the address, or head back to the homepage.</p>
        <Link to="/" className="btn btn-primary mt-6">Go to homepage</Link>
      </div>
    </div>
  );
}
