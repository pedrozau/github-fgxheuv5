import React from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { ANGOLA_BOUNDS } from '../../lib/constants/map';
import toast from 'react-hot-toast';

interface LocationMarkerProps {
  position: LatLng;
  setPosition: (position: LatLng) => void;
}

export default function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      const newPosition = e.latlng;
      if (ANGOLA_BOUNDS.contains(newPosition)) {
        setPosition(newPosition);
      } else {
        toast.error('Por favor, selecione uma localização dentro de Angola');
      }
    },
  });

  return <Marker position={position} />;
}