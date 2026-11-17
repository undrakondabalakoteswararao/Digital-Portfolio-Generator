import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const LINKS = [['Home', '#home'], ['Features', '#features'], ['Templates', '#templates'], ['About', '#about'], ['Contact', '#contact']];

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const cta = user ? (
    <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
  ) : (
    <>
      <Link to="/login" className="btn btn-ghost">Login</Link>
      <Link to="/register" className="btn btn-primary">Sign Up</Link>
    </>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {LINKS.map(([l, h]) => <a key={h} href={h} className="text-sm font-medium text-muted transition hover:text-ink">{l}</a>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex"><ThemeToggle />{cta}</div>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button className="btn btn-ghost !p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {open && (
        <div className="space-y-1 border-t border-line px-6 pb-4 pt-2 md:hidden">
          {LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-brand-soft hover:text-ink">{l}</a>)}
          <div className="flex gap-2 pt-2">{cta}</div>
        </div>
      )}
    </header>
  );
}
