import { supabase } from '../supabase';

const BUCKET_NAME = 'products';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImage(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Arquivo muito grande. O tamanho máximo é 5MB.');
  }
}

export async function uploadImage(file: File): Promise<string> {
  validateImage(file);

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error('Erro ao fazer upload da imagem');
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const fileName = url.split('/').pop();
    if (!fileName) throw new Error('URL da imagem inválida');

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Erro ao deletar imagem');
  }
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(uploadImage);
  return Promise.all(uploadPromises);
}