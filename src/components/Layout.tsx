import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Scale, LayoutDashboard, Plus, MessageSquare, Zap, Palette, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/ThemeContext';
import { Analytics } from '@vercel/analytics/react';

const Layout: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [showSecretInput, setShowSecretInput] = useState(false);
  const [secret, setSecret] = useState('');

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret === '5795') {
      localStorage.setItem('creator_access', 'true');
      navigate('/hangar');
      setShowSecretInput(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:bg-primary/20 transition-all">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tighter leading-none">PROBO</h1>
              <p className="text-[10px] text-primary/70 uppercase tracking-widest font-sans">Law Firm</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link to="/cases/new" className="text-sm font-medium hover:text-primary flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Case
            </Link>
            <Link to="/consult" className="text-sm font-medium hover:text-primary flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Consult AI
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'botanical' ? 'navy' : 'botanical')}
              title="Switch Theme"
            >
              <Palette className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSecretInput(!showSecretInput)}
            >
              <Lock className="h-4 w-4 opacity-30" />
            </Button>

            {showSecretInput && (
              <form onSubmit={handleSecretSubmit} className="absolute top-16 right-4 bg-card p-2 border border-border rounded shadow-xl animate-in fade-in slide-in-from-top-2 z-[100]">
                <input
                  type="password"
                  placeholder="Secret Code"
                  className="bg-background border border-border px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-primary w-24"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  autoFocus
                />
              </form>
            )}

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase">
                <Zap className="h-2.5 w-2.5 animate-pulse" /> Vortex Active
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border/50 py-8 bg-muted/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground italic">
            "Every impossible case has a quantum path to victory."
          </p>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold opacity-40">
            <span>9,999,999 Agents</span>
            <span>195 Jurisdictions</span>
            <span>Quantum V1.2</span>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
};

export default Layout;
