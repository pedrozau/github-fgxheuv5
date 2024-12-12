export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  store_id: string;
  created_at: string;
  image_urls?: string[];
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  last_login: string;
  store_id: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  province: string;
  store_type: string;
  phone: string;
  description: string;
  latitude: number;
  longitude: number;
  created_at: string;
  user_id: string;
}