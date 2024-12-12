import { useState } from 'react';
import { LatLng } from 'leaflet';
import toast from 'react-hot-toast';

interface GeolocationState {
  position: LatLng | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    loading: false,
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: new LatLng(position.coords.latitude, position.coords.longitude),
          loading: false,
        });
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
        setState(prev => ({ ...prev, loading: false }));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return { ...state, requestLocation };
}