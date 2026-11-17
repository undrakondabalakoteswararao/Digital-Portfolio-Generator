import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-brand p-12 text-brand-fg lg:flex">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-fg text-brand">P</span> PortfolioForge</Link>
        <div>
          <p className="text-4xl font-extrabold leading-tight">Your work deserves more than a list on a resume.</p>
          <p className="mt-4 max-w-md opacity-85">Add your projects, skills and education once. PortfolioForge turns them into a portfolio page and a PDF resume you can send to any recruiter.</p>
        </div>
        <p className="text-sm opacity-75">Built for students and freshers.</p>
      </div>
      <div className="flex flex-col px-6 py-6 sm:px-12">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden"><Logo /></div>
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </div>
      </div>
    </div>
  );
}
