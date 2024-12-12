import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Store } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { LatLng } from 'leaflet';
import toast from 'react-hot-toast';
import { registerStore } from '../lib/stores';
import MapSearch from '../components/MapSearch';
import 'leaflet/dist/leaflet.css';

// Angola provinces
const provinces = [
  'Luanda',
  'Benguela',
  'Huíla',
  'Huambo',
  'Cabinda',
  'Malanje',
  'Cuanza Sul',
  'Cuanza Norte',
  'Uíge',
  'Zaire',
  'Cunene',
  'Lunda Norte',
  'Lunda Sul',
  'Bengo',
  'Moxico',
  'Cuando Cubango',
  'Bié',
  'Namibe'
];

const storeTypes = [
  'Mercearia',
  'Supermercado',
  'Loja de Roupas',
  'Farmácia',
  'Restaurante',
  'Padaria',
  'Outro'
];

// Custom marker icon fix for Leaflet
import { Icon } from 'leaflet';
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker({ position, setPosition }: { 
  position: LatLng | null;
  setPosition: (position: LatLng) => void;
}) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
}

function MapController({ position }: { position: LatLng | null }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (position) {
      map.flyTo(position, 16);
    }
  }, [position, map]);

  return null;
}

export default function StoreRegistrationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Initial coordinates set to Luanda, Angola
  const [position, setPosition] = useState<LatLng | null>(new LatLng(-8.8389, 13.2894));
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

  const handleLocationSelect = (newPosition: LatLng) => {
    setPosition(newPosition);
  };

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
      toast.success('Loja cadastrada com sucesso! Verifique seu e-mail para confirmar o cadastro.');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao cadastrar loja');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Store className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Cadastro de Loja
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Crie sua conta para começar a vender no Compra Barato
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome da Loja
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Província
                </label>
                <select
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Selecione a província</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Loja
                </label>
                <select
                  required
                  value={formData.storeType}
                  onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Selecione o tipo de loja</option>
                  {storeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+244"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição da Loja
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline-block h-4 w-4 mr-1" />
                Localização em Angola
              </label>
              
              <div className="mb-4">
                <MapSearch onLocationSelect={handleLocationSelect} />
              </div>

              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapContainer
                  center={position || [-8.8389, 13.2894]}
                  zoom={6}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker position={position} setPosition={setPosition} />
                  <MapController position={position} />
                </MapContainer>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Pesquise um endereço ou clique no mapa para selecionar a localização da sua loja
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Loja'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}