import { supabase } from '../supabase';
import type { PaginationParams, PaginatedResponse } from '../types/pagination';
import type { Product } from './types';

export async function getStoreId() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) throw new Error('Store not found');
  return store.id;
}

export async function getProducts({ page = 1, limit = 10 }: PaginationParams): Promise<PaginatedResponse<Product>> {
  const storeId = await getStoreId();
  const offset = (page - 1) * limit;

  // Get total count
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', storeId);

  // Get paginated data
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: data || [],
    metadata: {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}