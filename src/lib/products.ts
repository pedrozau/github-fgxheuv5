import { supabase } from './supabase';
import type { Product } from './supabase-types';
import { createActivity } from './activity';

export async function uploadProductImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('products')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function getProducts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) throw new Error('Store not found');

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'store_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!store) throw new Error('Store not found');

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      store_id: store.id,
    })
    .select()
    .single();

  if (error) throw error;

  await createActivity({
    store_id: store.id,
    user_id: user.id,
    user_name: user.email as string,
    action_type: 'create',
    resource_type: 'product',
    description: `Produto "${product.name}" foi criado`
  });

  return data;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user.id)
    .single();

  await createActivity({
    store_id: store.id,
    user_id: user.id,
    user_name: user.email as string,
    action_type: 'update',
    resource_type: 'product',
    description: `Produto "${product.name}" foi atualizado`
  });

  return data;
}

export async function deleteProduct(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: product } = await supabase
    .from('products')
    .select('name, store_id')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;

  await createActivity({
    store_id: product.store_id,
    user_id: user.id,
    user_name: user.email as string,
    action_type: 'delete',
    resource_type: 'product',
    description: `Produto "${product.name}" foi removido`
  });
}