
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Scale, Plus, MessageSquare, LayoutDashboard, Zap, LogOut } from 'lucide-react';
import { Button } from './components/ui';
import { useAuth } from './services/AuthService';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cases/new', label: 'New Case', icon: Plus },
  { to: '/consult', label: 'Consult AI', icon: MessageSquare },
];

export default function Layout() {
  const location = useLocation();
  const { isLoading, logout } = useAuth();

  if (isLoading) return <div className="p-20 text-center uppercase font-black font-display tracking-widest animate-pulse">Synchronizing Neural Channels...</div>;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/dashboard" className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-display font-black text-foreground text-sm tracking-[0.2em] uppercase">Probo Law Firm</p>
                <div className="flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-widest">
                  <Zap className="h-2.5 w-2.5 animate-pulse" /> <span>Quantum Online</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === to ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground border border-border rounded-full px-4 py-2">
                 <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 9,999,999 NODES ACTIVE
              </div>
              <Button onClick={() => logout()} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors bg-transparent border-none shadow-none">
                <LogOut className="h-4 w-4 mr-2" /> <span className="hidden md:inline">Exit Cluster</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main><Outlet /></main>
    </div>
  );
}
