import { useState } from 'react';
import { Shield, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CookieBanner() {
  const [show, setShow] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('vortex_cookie_consent');
    }
    return false;
  });

  const [customizing, setCustomizing] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false
  });

  const acceptAll = () => {
    localStorage.setItem('vortex_cookie_consent', JSON.stringify({ ...preferences, marketing: true }));
    setShow(false);
  };

  const saveCustom = () => {
    localStorage.setItem('vortex_cookie_consent', JSON.stringify(preferences));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] md:max-w-xl md:left-auto">
      <Card className="p-6 border-primary/20 shadow-2xl bg-card/95 backdrop-blur-xl text-foreground">
        {!customizing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="font-display font-bold">Privacy Control Center</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Probo Law Firm uses cookies to ensure neural link stability and analyze global case trends. By continuing, you accept our specialized data protocols.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={acceptAll} className="flex-1">Synchronize All Cookies</Button>
              <Button onClick={() => setCustomizing(true)} variant="outline">Customize Protocols</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold">Protocol Customization</h3>
              </div>
              <button onClick={() => setCustomizing(false)} aria-label="Close customization"><X className="h-4 w-4" /></button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs font-bold">Essential Neural Hooks</p>
                  <p className="text-[10px] text-muted-foreground">Required for VORTEX encryption.</p>
                </div>
                <input type="checkbox" checked readOnly />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs font-bold">Analytics Superposition</p>
                  <p className="text-[10px] text-muted-foreground">Helps us map case win probabilities.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.analytics} 
                  onChange={e => setPreferences({...preferences, analytics: e.target.checked})} 
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs font-bold">Global Outreach</p>
                  <p className="text-[10px] text-muted-foreground">Inform you about local legal victories.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.marketing} 
                  onChange={e => setPreferences({...preferences, marketing: e.target.checked})} 
                />
              </div>
            </div>

            <Button onClick={saveCustom} className="w-full">Initialize Selected Protocols</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
