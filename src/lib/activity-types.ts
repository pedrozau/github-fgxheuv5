export interface Activity {
  id: string;
  user_id: string;
  store_id: string;
  user_name: string;
  action_type: 'create' | 'update' | 'delete';
  resource_type: 'product' | 'user';
  description: string;
  created_at: string;
}
