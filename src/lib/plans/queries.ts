import { supabase } from '../supabase';
import type { Subscription } from './types';

export async function getCurrentSubscription(): Promise<Subscription | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!store) throw new Error('Loja não encontrada');

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('store_id', store.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw new Error('Erro ao carregar informações do plano');
  }
}

export async function getProductCount(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!store) throw new Error('Loja não encontrada');

    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', store.id);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error fetching product count:', error);
    throw new Error('Erro ao carregar quantidade de produtos');
  }
}