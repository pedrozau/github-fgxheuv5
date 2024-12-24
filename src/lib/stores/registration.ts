import { supabase } from '../supabase';
import { createActivity } from '../activity';
import type { StoreRegistrationData } from './types';

export async function registerStore(storeData: StoreRegistrationData) {
  // Create the user account in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: storeData.email,
    password: storeData.password,
    options: {
      data: {
        role: 'store_owner',
      },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (authError) {
    console.error('Auth error:', authError);
    throw new Error(
      authError.message === 'User already registered'
        ? 'Este email já está cadastrado'
        : 'Erro ao criar conta'
    );
  }

  if (!authData.user) {
    throw new Error('Erro ao criar conta de usuário');
  }

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