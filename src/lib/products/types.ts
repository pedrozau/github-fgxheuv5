export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_urls: string[];
  store_id: string;
  user_id: string;
  created_at: string;
}