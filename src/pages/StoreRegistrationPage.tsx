import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { LatLng } from 'leaflet';
import Button from '../components/Button';
import StoreRegistrationForm from '../components/forms/StoreRegistrationForm';
import { registerStore } from '../lib/stores/registration';
import { showEmailConfirmationNotification } from '../lib/notifications/toast';
import toast from 'react-hot-toast';

export default function StoreRegistrationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<LatLng | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    province: '',
    storeType: '',
    phone: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (!position) {
        throw new Error('Por favor, selecione a localização da loja no mapa');
      }

      const storeData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        province: formData.province,
        store_type: formData.storeType,
        phone: formData.phone,
        description: formData.description,
        latitude: position.lat,
        longitude: position.lng,
      };

      await registerStore(storeData);
      showEmailConfirmationNotification(formData.email);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao cadastrar loja');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <Store className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crie sua conta para começar a vender no Compra Barato
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Preencha os dados abaixo para cadastrar sua loja
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <StoreRegistrationForm
            formData={formData}
            setFormData={setFormData}
            position={position}
            setPosition={setPosition}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}