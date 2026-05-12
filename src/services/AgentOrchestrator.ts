
import { supabase } from '@/lib/supabase';

export class AgentOrchestrator {
  async getMajorAgents() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .limit(100);
    
    if (error) return [];
    return data;
  }
}

export const orchestrator = new AgentOrchestrator();
