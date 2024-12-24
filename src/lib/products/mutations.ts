import { supabase } from '../supabase';
import { getStoreId } from './queries';
import type { Product } from './types';
import { createActivity } from '../activity';
import { uploadMultipleImages } from '../storage/products';

export async function createProduct(
  product: Omit<Product, 'id' | 'created_at' | 'store_id' | 'user_id'> & { images: File[] }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const storeId = await getStoreId();

  // Upload images first
  const imageUrls = await uploadMultipleImages(product.images);

  const productData = {
    name: product.name,
    description: product.description,
    price: product.price,
    image_urls: imageUrls,
    store_id: storeId,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw new Error('Erro ao criar produto');
  }

  await createActivity({
    store_id: storeId,
    user_id: user.id,
    user_name: user.email as string,
    action_type: 'create',
    resource_type: 'product',
    description: `Produto "${product.name}" foi criado`,
  });

  return data;
}

export async function updateProduct(
  id: string, 
  product: Partial<Product> & { newImages?: File[] }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const storeId = await getStoreId();

  let imageUrls = product.image_urls || [];

  // Upload new images if any
  if (product.newImages && product.newImages.length > 0) {
    const newImageUrls = await uploadMultipleImages(product.newImages);
    imageUrls = [...imageUrls, ...newImageUrls];
  }

  const productData = {
    ...product,
    image_urls: imageUrls,
    user_id: user.id,
  };

  // Remove newImages from the data to be sent to Supabase
  delete productData.newImages;

  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .eq('store_id', storeId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw new Error('Erro ao atualizar produto');
  }

  await createActivity({
    store_id: storeId,
    user_id: user.id,
    user_name: user.email as string,
    action_type: 'update',
    resource_type: 'product',
    description: `Produto "${product.name}" foi atualizado`,
  });

  return data;
}

export async function deleteProduct(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const storeId = await getStoreId();

  // Get product details before deletion
  const { data: product } = await supabase
    .from('products')
    .select('name')
    .eq('id', id)
    .single();

  if (!product) {
    throw new Error('Produto não encontrado');
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('store_id', storeId);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error('Erro ao deletar produto');
  }

  await createActivity({
    store_id: storeId,
    user_id: user.id,
    user_name: user.email as string,
    action_type: 'delete',
    resource_type: 'product',
    description: `Produto "${product.name}" foi removido`,
  });
}