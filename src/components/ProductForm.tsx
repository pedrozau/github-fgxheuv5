import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import Button from './Button';
import toast from 'react-hot-toast';
import { createProduct, updateProduct } from '../lib/products/mutations';
import type { Product } from '../lib/products/types';
import MultipleImageUpload from './MultipleImageUpload';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({
  onClose,
  onSuccess,
  product,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(product?.image_urls || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image_urls: previews,
      };

      if (product?.id) {
        await updateProduct(product.id, {
          ...productData,
          newImages: images,
        });
        toast.success('Produto atualizado com sucesso!');
      } else {
        await createProduct(productData);
        toast.success('Produto criado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (files: File[]) => {
    setImages(files);
    
    // Create preview URLs for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleImageRemove = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            icon={<X className="h-4 w-4" />}
          >
            Fechar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <MultipleImageUpload
            images={images}
            previews={previews}
            onChange={handleImageChange}
            onRemove={handleImageRemove}
          />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Produto
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preço
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              icon={<Plus className="h-4 w-4" />}
            >
              {product ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}