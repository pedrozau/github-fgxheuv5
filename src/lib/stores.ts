import { supabase } from './supabase';
import type { Store } from './supabase-types';
import { createActivity } from './activity';

interface StoreRegistrationData {
  name: string;
  email: string;
  password: string;
  province: string;
  store_type: string;
  phone: string;
  description: string;
  latitude: number;
  longitude: number;
}

export async function registerStore(storeData: StoreRegistrationData) {
  // First, create the user account in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: storeData.email,
    password: storeData.password,
    options: {
      data: {
        role: 'store_owner',
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user account');

  try {
    // Create the store record
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name: storeData.name,
        email: storeData.email,
        province: storeData.province,
        store_type: storeData.store_type,
        phone: storeData.phone,
        description: storeData.description,
        latitude: storeData.latitude,
        longitude: storeData.longitude,
        user_id: authData.user.id,
      })
      .select()
      .single();

    if (storeError) throw storeError;

    // Create the initial admin user in store_users table
    const { error: userError } = await supabase
      .from('store_users')
      .insert({
        name: storeData.name,
        email: storeData.email,
        role: 'admin',
        store_id: store.id,
      });

    if (userError) throw userError;

    // Create initial activity
    await createActivity({
      store_id: store.id,
      user_id: authData.user.id,
      user_name: storeData.email,
      action_type: 'create',
      resource_type: 'user',
      description: 'Loja criada e administrador configurado'
    });

    return { user: authData.user, store };
  } catch (error) {
    // If anything fails after auth user creation, clean up the auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw error;
  }
}

export async function updateStore(id: string, storeData: Partial<Store>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('stores')
    .update(storeData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;

  await createActivity({
    store_id: id,
    user_id: user.id,
    user_name: user.email as string,
    action_type: 'update',
    resource_type: 'user',
    description: 'Informações da loja atualizadas'
  });

  return data;
}

export async function getStore() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function getStoreByUserId(userId: string) {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}