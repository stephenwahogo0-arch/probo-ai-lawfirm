
import { useNavigate } from 'react-router-dom';
import { Zap, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { aiService } from '@/services/AIService';
import { dossierService } from '@/services/DossierService';
import React, { useState } from 'react';

export default function NewCasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [form, setForm] = useState({
    title: '',
    type: 'Criminal Law',
    jurisdiction: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("VORTEX: Initiating analysis...");
    setLoading(true);
    setStreamedText('');

    try {
      let fullReport = '';
      for await (const chunk of aiService.streamResponse(form.description)) {
        fullReport += chunk;
        setStreamedText(fullReport);
      }

      console.log("VORTEX: Calling backend for dossier creation...");
      const newCase = await dossierService.createCase({
        ...form,
        report: fullReport
      });

      console.log("VORTEX: Dossier created. Redirecting to:", newCase.id);
      navigate(`/cases/${newCase.id}`);
    } catch (err) {
      console.error("VORTEX ERROR:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
         <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <h1 className="text-2xl font-display font-bold text-foreground">Quantum Analysis in Progress...</h1>
         </div>
         <Card className="bg-foreground text-background font-mono text-xs p-6 h-[400px] overflow-y-auto">
            <pre className="whitespace-pre-wrap">{streamedText}</pre>
         </Card>
         <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
               <div className="h-full bg-primary animate-pulse" style={{ width: '100%' }}></div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Case Intake Terminal</h1>
        <p className="text-muted-foreground">Initialize the VORTEX by providing foundational case facts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Case Title</label>
              <Input 
                placeholder="e.g., The People vs. Anderson" 
                value={form.title} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, title: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Jurisdiction</label>
                  <Input 
                    placeholder="e.g., International Criminal Court" 
                    value={form.jurisdiction} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, jurisdiction: e.target.value})}
                    required
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Case Type</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    value={form.type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({...form, type: e.target.value})}
                  >
                    <option>Criminal Law</option>
                    <option>Constitutional Law</option>
                    <option>Corporate Law</option>
                    <option>International Law</option>
                  </select>
               </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Foundational Facts</label>
              <Textarea 
                placeholder="Detail the timeline, evidence, and primary allegations..." 
                className="min-h-[150px]"
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({...form, description: e.target.value})}
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-xl border border-border">
           <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Shield className="h-4 w-4" /> 256-BIT ENCRYPTION ACTIVE
           </div>
           <Button type="submit" size="lg" className="gap-2">
              <Zap className="h-4 w-4" /> Activate VORTEX Analysis
           </Button>
        </div>
      </form>
    </div>
  );
}
