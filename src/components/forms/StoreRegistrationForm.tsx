import React from 'react';
import { Store, MapPin } from 'lucide-react';
import { LatLng } from 'leaflet';
import Button from '../Button';
import MapSearch from '../MapSearch';
import LocationButton from '../LocationButton';
import MapContainer from '../map/MapContainer';
import { ANGOLA_BOUNDS } from '../../lib/constants/map';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  password: string;
  province: string;
  store_type: string;
  phone: string;
  description: string;
}

interface StoreRegistrationFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  position: LatLng | null;
  setPosition: (position: LatLng) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function StoreRegistrationForm({
  formData,
  setFormData,
  position,
  setPosition,
  loading,
  onSubmit,
}: StoreRegistrationFormProps) {
  const handleLocationSelect = (lat: number, lng: number) => {
    const newPosition = new LatLng(lat, lng);
    if (ANGOLA_BOUNDS.contains(newPosition)) {
      setPosition(newPosition);
    } else {
      toast.error('Por favor, selecione uma localização dentro de Angola');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      toast.error('Por favor, selecione a localização da sua loja');
      return;
    }
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields remain the same */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome da Loja
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Província
            </label>
            <select
              required
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            >
              <option value="">Selecione uma província</option>
              <option value="luanda">Luanda</option>
              <option value="benguela">Benguela</option>
              <option value="huambo">Huambo</option>
              <option value="huila">Huíla</option>
              <option value="cabinda">Cabinda</option>
              <option value="cunene">Cunene</option>
              <option value="lunda-norte">Lunda Norte</option>
              <option value="lunda-sul">Lunda Sul</option>
              <option value="malanje">Malanje</option>
              <option value="moxico">Moxico</option>
              <option value="namibe">Namibe</option>
              <option value="uige">Uíge</option>
              <option value="zaire">Zaire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Loja
            </label>
            <select
              required
              value={formData.store_type}
              onChange={(e) => setFormData({ ...formData, store_type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            >
              <option value="">Selecione um tipo</option>
              <option value="retail">Varejo</option>
              <option value="wholesale">Atacado</option>
              <option value="both">Ambos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
              placeholder="+244"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
        />
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline-block h-4 w-4 mr-1" />
          Localização em Angola
        </label>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <MapSearch onLocationSelect={handleLocationSelect} />
            </div>
            <LocationButton onLocationSelect={handleLocationSelect} />
          </div>

          <MapContainer position={position} setPosition={setPosition} />
          
          <p className="text-sm text-gray-500">
            Pesquise um endereço, use sua localização atual ou clique no mapa para selecionar a localização da sua loja
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Button
          type="submit"
          isLoading={loading}
          className="w-full py-2.5"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Loja'}
        </Button>
      </div>
    </form>
  );
}