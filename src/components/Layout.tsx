
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Scale, Plus, MessageSquare, LayoutDashboard, Zap, LogOut, Mail, Smartphone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/services/AuthService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import CookieBanner from '@/components/CookieBanner';
import { useState } from 'react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cases/new', label: 'New Case', icon: Plus },
  { to: '/consult', label: 'Neural Link', icon: MessageSquare },
];

export default function Layout() {
  const location = useLocation();
  const { user, loginWithGoogle, loginWithMagicLink, loginWithPhone, logout, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [authMode, setAuthMode] = useState<'options' | 'email' | 'phone'>('options');

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-display font-bold">VORTEX INITIALIZING...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Scale className="h-8 w-8 text-primary" />
             </div>
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tighter text-foreground">PROBO LAW FIRM</h1>
            <p className="text-muted-foreground mt-2 uppercase text-[10px] font-bold tracking-[0.2em]">The Singularity of Law</p>
          </div>

          <Card className="border-border/60 shadow-xl overflow-hidden">
            <CardContent className="p-0">
               {authMode === 'options' && (
                  <div className="p-6 space-y-3">
                     <p className="text-sm font-medium mb-6 text-foreground">Choose your neural entry point</p>
                     <Button onClick={() => loginWithGoogle()} variant="outline" className="w-full gap-3 h-12 shadow-sm">
                        <Globe className="h-4 w-4 text-blue-500" /> Continue with Google
                     </Button>
                     <Button onClick={() => setAuthMode('email')} variant="outline" className="w-full gap-3 h-12 shadow-sm">
                        <Mail className="h-4 w-4 text-primary" /> Continue with Email
                     </Button>
                     <Button onClick={() => setAuthMode('phone')} variant="outline" className="w-full gap-3 h-12 shadow-sm">
                        <Smartphone className="h-4 w-4 text-primary" /> Continue with Phone
                     </Button>
                  </div>
               )}

               {authMode === 'email' && (
                  <div className="p-6 space-y-4">
                     <p className="text-sm font-medium text-foreground">Initialize Magic Link</p>
                     <Input 
                        placeholder="Enter legal email..." 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="h-12"
                     />
                     <Button onClick={() => loginWithMagicLink(email)} className="w-full h-12">Send Link</Button>
                     <button onClick={() => setAuthMode('options')} className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary">Back to options</button>
                  </div>
               )}

               {authMode === 'phone' && (
                  <div className="p-6 space-y-4">
                     <p className="text-sm font-medium text-foreground">Neural OTP Synchronization</p>
                     <Input 
                        placeholder="+254..." 
                        type="tel" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        className="h-12"
                     />
                     <Button onClick={() => loginWithPhone(phone)} className="w-full h-12">Send OTP</Button>
                     <button onClick={() => setAuthMode('options')} className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary">Back to options</button>
                  </div>
               )}
            </CardContent>
          </Card>
          
          <div className="pt-4 space-y-4">
             <p className="text-[10px] text-muted-foreground">Admin access code required for high-tier protocols.</p>
             <div className="flex justify-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-help">
                <div className="p-2 bg-white rounded-lg border border-black shadow-inner">
                   <div className="w-20 h-20 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://probo.law')] bg-cover"></div>
                </div>
             </div>
             <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Scan to install on iOS/Android</p>
          </div>
        </div>
        <CookieBanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div className="hidden md:block">
                <div className="font-display font-bold text-sm tracking-widest uppercase text-foreground">Probo Law Firm</div>
                <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                   <Zap className="h-2 w-2" /> QUANTUM PROTOCOLS ONLINE
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
                    location.pathname === to ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  AGENTS: 10,000,000
               </div>
               <Button variant="outline" size="sm" onClick={() => logout()} className="h-8 gap-2">
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
               </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <CookieBanner />
    </div>
  );
}
