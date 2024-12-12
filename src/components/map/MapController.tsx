import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { MAP_CONFIG } from '../../lib/constants/map';

interface MapControllerProps {
  position: LatLng;
}

export default function MapController({ position }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, MAP_CONFIG.defaultZoom);
    }
  }, [position, map]);

  return null;
}