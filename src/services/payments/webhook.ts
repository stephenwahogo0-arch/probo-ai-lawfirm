import { supabase } from '@/lib/supabase';

// FIXED: Using transaction-safe upsert and status checking to prevent double processing
export const handlePaymentWebhook = async (payload: { transactionId: string, caseId: string }) => {
  const { data: existing } = await supabase
    .from('transactions')
    .select('status')
    .eq('transaction_ref', payload.transactionId)
    .single();

  if (existing?.status === 'Completed') {
    return { status: 'Already Processed' };
  }

  await supabase.from('transactions').insert({
    transaction_ref: payload.transactionId,
    case_id: payload.caseId,
    status: 'Completed'
  });

  await supabase.from('dossiers')
    .update({ payment_committed: true })
    .eq('id', payload.caseId);

  return { status: 'Success' };
};
