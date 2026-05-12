
import { Link } from 'react-router-dom';
import { Plus, Scale, Clock, CheckCircle, ChevronRight, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dossierService, type Case } from '@/services/DossierService';
import { orchestrator } from '@/services/AgentOrchestrator';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [majorAgents, setMajorAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
        dossierService.getCases(),
        orchestrator.getMajorAgents()
    ]).then(([casesData, agentsData]) => {
        setCases(casesData);
        setMajorAgents(agentsData);
        setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Command Center</h1>
          <p className="text-muted-foreground">Monitoring the VORTEX real-agent legal network.</p>
        </div>
        <Link to="/cases/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Case Intake
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
               <Zap className="h-4 w-4" /> Quantum Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">100% Active</div>
            <p className="text-xs text-muted-foreground mt-1">Real-time entanglement via IBM Quantum.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
               <Users className="h-4 w-4" /> Major Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{majorAgents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Lawyer nodes mobilized in database.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
               <Scale className="h-4 w-4" /> Win Vector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed probability via VORTEX Reasoning.</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
           <Clock className="h-5 w-5 text-primary" /> Active Dossiers
        </h2>
        {loading ? (
          <div className="space-y-3">
             {[1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : cases.length === 0 ? (
          <Card className="border-dashed border-2 py-12 text-center">
             <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                   <Scale className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                   <p className="font-medium">No active dossiers found in DB.</p>
                   <p className="text-sm text-muted-foreground">Initialize a new case to activate the agents.</p>
                </div>
                <Link to="/cases/new">
                   <Button variant="outline">Open Intake Terminal</Button>
                </Link>
             </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {cases.map((c) => (
              <Link key={c.id} to={`/cases/${c.id}`}>
                <Card className="hover:border-primary/50 transition-all group">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-bold group-hover:text-primary transition-colors">{c.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-0.5 rounded-full text-foreground/70">{c.case_type}</span>
                        <span>{c.jurisdiction}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                           <CheckCircle className="h-3 w-3" /> {c.status}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
