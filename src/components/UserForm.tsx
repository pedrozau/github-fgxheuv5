import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import Button from './Button';
import toast from 'react-hot-toast';
import { createUser, updateUser } from '../lib/users';
import type { User } from '../lib/supabase-types';

interface UserFormProps {
  onClose: () => void;
  onSuccess: () => void;
  user?: User;
}

export default function UserForm({ onClose, onSuccess, user }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'staff',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role as 'admin' | 'staff',
        ...(formData.password ? { password: formData.password } : {}),
      };

      if (user) {
        await updateUser(user.id, userData);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        if (!formData.password) {
          throw new Error('Senha é obrigatória para novos usuários');
        }
        await createUser(userData);
        toast.success('Usuário criado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
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
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required={!user}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cargo
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="admin">Administrador</option>
              <option value="staff">Funcionário</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
              icon={<UserPlus className="h-4 w-4" />}
            >
              {user ? 'Atualizar' : 'Criar'} Usuário
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}