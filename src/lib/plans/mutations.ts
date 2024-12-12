import { supabase } from '../supabase';
import { createActivity } from '../activity';
import type { Subscription } from './types';

export async function updateSubscription(planId: string): Promise<Subscription> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) throw new Error('Loja não encontrada');

  // Create or update subscription
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .upsert({
      store_id: store.id,
      plan_id: planId,
      status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }, {
      onConflict: 'store_id'
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Erro ao atualizar plano');
  }

  // Log activity
  await createActivity({
    store_id: store.id,
    user_id: user.id,
    user_name: user.email as string,
    action_type: 'update',
    resource_type: 'user',
    description: `Plano atualizado com sucesso`
  });

  return subscription;
}