import { supabase } from './supabase';
import type { Activity } from './activity-types';

export async function createActivity(
  activity: Omit<Activity, 'id' | 'created_at'>
) {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRecentActivity() {
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (!store) throw new Error('Store not found');

  const { data, error } = await supabase
    .from('activities')
    .select(
      `
      id,
      user_id,
      user_name,
      action_type,
      resource_type,
      description,
      created_at
    `
    )
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}
