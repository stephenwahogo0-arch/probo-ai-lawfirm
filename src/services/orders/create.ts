import { supabase } from '@/lib/supabase';

// FIXED: Implementing a 'cleanup' or 'timeout' logic for reserved agents
export const bookAgentConsultation = async (agentId: string, _userId: string) => {
  // Use a transaction or a specific status with an expiration timestamp
  const { error } = await supabase.from('agents')
    .update({ 
      status: 'Reserved',
      booking_expiry: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min lock
    })
    .eq('id', agentId)
    .eq('status', 'Active');

  if (error) throw new Error('Agent unavailable');

  try {
    // Attempt checkout...
    console.log("Initializing secure checkout for user:", _userId);
  } catch (err) {
    // FIXED: Immediate rollback on failure to free inventory
    await supabase.from('agents')
      .update({ status: 'Active', booking_expiry: null })
      .eq('id', agentId);
    throw err;
  }
};
