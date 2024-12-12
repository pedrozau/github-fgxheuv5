import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import Button from '../components/Button';

export default function ProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 mt-16 lg:mt-0 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os produtos da sua loja
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setIsFormOpen(true)}
            icon={<Plus className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            Novo Produto
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <ProductList key={refreshKey} />
      </div>

      {isFormOpen && (
        <ProductForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}