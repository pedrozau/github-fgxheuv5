import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface LocationButtonProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationButton({ onLocationSelect }: LocationButtonProps) {
  const [loading, setLoading] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSelect(position.coords.latitude, position.coords.longitude);
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informação de localização indisponível';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo de espera para obter localização esgotado';
            break;
        }
        toast.error(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <button
      type="button"
      onClick={requestLocation}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MapPin className="h-5 w-5 mr-2 text-gray-400" />
      {loading ? 'Obtendo localização...' : 'Usar minha localização'}
    </button>
  );
}