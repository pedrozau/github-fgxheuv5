import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { getProducts } from '../lib/products/queries';
import { deleteProduct } from '../lib/products/mutations';
import type { Product } from '../lib/products/types';
import type { PaginatedResponse } from '../lib/types/pagination';
import toast from 'react-hot-toast';
import ProductForm from './ProductForm';
import Pagination from './Pagination';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState<PaginatedResponse<Product>['metadata'] | null>(null);

  const loadProducts = async (page: number) => {
    try {
      const response = await getProducts({ page, limit: 10 });
      setProducts(response.data);
      setMetadata(response.metadata);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
        toast.success('Produto excluído com sucesso!');
        loadProducts(currentPage);
      } catch (error) {
        toast.error('Erro ao excluir produto');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.image_urls?.[0] && (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.image_urls[0]}
                          alt={product.name}
                        />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA'
                  }).format(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {metadata && metadata.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={metadata.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            loadProducts(currentPage);
            setEditingProduct(null);
          }}
        />
      )}
    </>
  );
}