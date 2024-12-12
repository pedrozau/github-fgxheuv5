import { supabase } from './supabase';
import type { User } from './supabase-types';
import { createActivity } from './activity';

export async function createUser(userData: Omit<User, 'id' | 'last_login'>) {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error('Not authenticated');

  // Get the store for the current user
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', currentUser.id)
    .single();

  if (!store) throw new Error('Store not found');

  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: Math.random().toString(36).slice(-8), // Generate random password
    email_confirm: true,
    user_metadata: {
      role: userData.role,
      store_id: store.id
    }
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create auth user');

  // Then create the store user
  const { data, error } = await supabase
    .from('store_users')
    .insert({
      ...userData,
      store_id: store.id,
    })
    .select()
    .single();

  if (error) {
    // Cleanup auth user if store user creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw error;
  }

  await createActivity({
    store_id: store.id,
    user_id: currentUser.id,
    user_name: currentUser.email as string,
    action_type: 'create',
    resource_type: 'user',
    description: `Usuário "${userData.name}" foi criado`
  });

  return data;
}

export async function updateUser(id: string, userData: Partial<User>) {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('store_users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', currentUser.id)
    .single();

  await createActivity({
    store_id: store.id,
    user_id: currentUser.id,
    user_name: currentUser.email as string,
    action_type: 'update',
    resource_type: 'user',
    description: `Usuário "${userData.name}" foi atualizado`
  });

  return data;
}

export async function deleteUser(id: string) {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error('Not authenticated');

  // Get user details before deletion
  const { data: user } = await supabase
    .from('store_users')
    .select('name, store_id, email')
    .eq('id', id)
    .single();

  if (!user) throw new Error('User not found');

  // Delete the store user
  const { error } = await supabase
    .from('store_users')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Delete the auth user
  const { data: authUser } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', user.email)
    .single();

  if (authUser) {
    await supabase.auth.admin.deleteUser(authUser.id);
  }

  await createActivity({
    store_id: user.store_id,
    user_id: currentUser.id,
    user_name: currentUser.email as string,
    action_type: 'delete',
    resource_type: 'user',
    description: `Usuário "${user.name}" foi removido`
  });
}

export async function getUsers() {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error('Not authenticated');

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', currentUser.id)
    .single();

  if (!store) throw new Error('Store not found');

  const { data, error } = await supabase
    .from('store_users')
    .select('*')
    .eq('store_id', store.id)
    .order('name');

  if (error) throw error;
  return data;
}