import { supabase } from '@/lib/supabase';

// FIXED: Using parameterized Supabase filter instead of string interpolation
export const searchFirmMembers = async (query: string) => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .ilike('name', `%${query}%`); // Safe: Supabase handles the escaping
    
  if (error) throw error;
  return data;
};
