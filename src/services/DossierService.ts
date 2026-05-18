
import { supabase } from '@/lib/supabase';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/vortex-api';

export interface Case {
  id: string;
  title: string;
  case_type: string;
  jurisdiction: string;
  description: string;
  report: string;
  status: string;
  payment_committed: boolean;
  created_at: string;
}

class DossierService {
  async getCases(): Promise<Case[]> {
    const { data, error } = await supabase
      .from('dossiers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Supabase Fetch Error:", error);
        return [];
    }
    return data as Case[];
  }

  async getCaseById(id: string): Promise<Case | undefined> {
    const { data, error } = await supabase
      .from('dossiers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as Case;
  }

  async createCase(data: any): Promise<Case> {
    try {
      const res = await axios.post(`${API_BASE}/dossiers`, null, {
        params: {
          title: data.title,
          case_type: data.type || data.case_type,
          jurisdiction: data.jurisdiction,
          description: data.description,
          creator_bypass: data.creator_bypass || false,
          firm_division: data.firm_division || 'Corporate'
        }
      });
      console.log("[v0] Case created via service:", res.data);
      return res.data;
    } catch (err) {
      console.error("[v0] DossierService.createCase error:", err);
      throw err;
    }
  }

  async commitPayment(id: string): Promise<void> {
    await axios.post(`${API_BASE}/dossiers/${id}/commit`);
  }
}

export const dossierService = new DossierService();
