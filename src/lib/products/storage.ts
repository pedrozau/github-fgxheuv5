import { supabase } from '../supabase';

/**
 * Deletes a product image from storage
 * @param url The public URL of the image to delete
 */
export async function deleteProductImage(url: string) {
  try {
    const path = url.split('/').pop();
    if (!path) throw new Error('Invalid image URL');

    const { error } = await supabase.storage
      .from('products')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Erro ao deletar imagem');
  }
}

/**
 * Validates a file before upload
 * @param file The file to validate
 */
export function validateProductImage(file: File) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.');
  }

  if (file.size > MAX_SIZE) {
    throw new Error('Arquivo muito grande. O tamanho máximo é 5MB.');
  }
}