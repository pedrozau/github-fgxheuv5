import { supabase } from '../supabase';
import type { Subscription } from './types';

export async function getCurrentSubscription(): Promise<Subscription | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) throw new Error('Store not found');

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('store_id', store.id)
    .eq('status', 'active')
    .single();

  return subscription;
}

export async function getProductCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) throw new Error('Store not found');

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store.id);

  return count || 0;
}

export async function updateSubscription(planId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) throw new Error('Store not found');

  // Here you would integrate with your payment gateway
  // For now, we'll just update the subscription in the database
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      store_id: store.id,
      plan_id: planId,
      status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

  if (error) throw error;
}