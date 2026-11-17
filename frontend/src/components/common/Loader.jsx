import { Loader2 } from 'lucide-react';

export function Spinner({ size = 18 }) {
  return <Loader2 size={size} className="animate-spin" aria-hidden="true" />;
}

export function FullPageLoader({ label = 'Loading...' }) {
  return (
    <div className="grid min-h-screen place-items-center bg-page text-muted" role="status">
      <div className="flex items-center gap-3"><Spinner size={22} /> {label}</div>
    </div>
  );
}
