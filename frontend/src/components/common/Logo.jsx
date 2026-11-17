import { Link } from 'react-router-dom';

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 font-extrabold tracking-tight text-ink">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-fg">P</span>
      <span className="text-lg">PortfolioForge</span>
    </Link>
  );
}
