import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, GraduationCap, Wrench, FolderGit2, Award, Briefcase, Trophy, Palette, Monitor, Settings, LogOut, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';
import { ProfileProvider, useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile', label: 'My Profile', icon: User },
  { to: '/dashboard/education', label: 'Education', icon: GraduationCap },
  { to: '/dashboard/skills', label: 'Skills', icon: Wrench },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/dashboard/certifications', label: 'Certifications', icon: Award },
  { to: '/dashboard/experience', label: 'Experience', icon: Briefcase },
  { to: '/dashboard/achievements', label: 'Achievements', icon: Trophy },
  { to: '/dashboard/templates', label: 'Templates', icon: Palette },
  { to: '/dashboard/preview', label: 'Portfolio Preview', icon: Monitor },
  { to: '/dashboard/settings', label: 'Account Settings', icon: Settings },
];

function Shell() {
  const { loading, error, reload } = useProfile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); toast.success('Logged out'); navigate('/login', { replace: true }); } catch { toast.error('Could not log out. Try again.'); }
  };

  const link = ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-brand-soft hover:text-ink'}`;

  return (
    <div className="min-h-screen lg:flex">
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center justify-between px-1">
          <Logo to="/dashboard" />
          <button className="btn btn-ghost !p-1.5 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Dashboard">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={link} onClick={() => setOpen(false)}><Icon size={18} /> {label}</NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-page/90 px-4 py-3 backdrop-blur sm:px-8">
          <button className="btn btn-ghost !p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <p className="hidden text-sm text-muted lg:block">Signed in as <span className="font-semibold text-ink">{user?.email}</span></p>
          <ThemeToggle />
        </header>
        <main className="px-4 py-8 sm:px-8">
          {loading ? (
            <div className="grid min-h-[50vh] place-items-center text-muted"><FullPageLoaderInline /></div>
          ) : error ? (
            <div className="card mx-auto max-w-md p-8 text-center">
              <h2 className="text-lg font-bold">Could not load your data</h2>
              <p className="mt-2 text-sm text-muted">{error}</p>
              <button className="btn btn-primary mt-5" onClick={reload}>Try again</button>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

function FullPageLoaderInline() {
  return <span role="status">Loading your workspace...</span>;
}

export default function DashboardLayout() {
  return (
    <ProfileProvider>
      <Shell />
    </ProfileProvider>
  );
}
