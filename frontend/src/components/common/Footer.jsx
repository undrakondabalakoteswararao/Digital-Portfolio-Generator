import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">A digital portfolio generator for students and freshers. Built as a Web Technology course project.</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Product</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><a href="#features" className="hover:text-ink">Features</a></li>
            <li><a href="#templates" className="hover:text-ink">Templates</a></li>
            <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Account</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/login" className="hover:text-ink">Login</Link></li>
            <li><Link to="/register" className="hover:text-ink">Sign up</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} PortfolioForge. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink"><Github size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-ink"><Linkedin size={18} /></a>
            <a href="mailto:hello@portfolioforge.example" aria-label="Email" className="hover:text-ink"><Mail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
