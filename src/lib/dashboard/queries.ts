import { supabase } from '../supabase';
import type { DashboardStats } from './types';

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!store) throw new Error('Loja não encontrada');

    const [productsResponse, usersResponse, activitiesResponse] = await Promise.all([
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', store.id),
      supabase
        .from('store_users')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', store.id),
      supabase
        .from('activities')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    if (productsResponse.error) throw productsResponse.error;
    if (usersResponse.error) throw usersResponse.error;
    if (activitiesResponse.error) throw activitiesResponse.error;

    return {
      totalProducts: productsResponse.count || 0,
      activeUsers: usersResponse.count || 0,
      recentActivities: activitiesResponse.data || []
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Erro ao carregar dados do dashboard');
  }
}