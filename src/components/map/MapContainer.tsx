import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { ANGOLA_BOUNDS, DEFAULT_CENTER, MAP_CONFIG } from '../../lib/constants/map';
import LocationMarker from './LocationMarker';
import MapController from './MapController';

interface MapProps {
  position: LatLng | null;
  setPosition: (position: LatLng) => void;
}

export default function MapContainer({ position, setPosition }: MapProps) {
  return (
    <div className="h-[300px] sm:h-[400px] rounded-lg overflow-hidden shadow-inner">
      <LeafletMapContainer
        center={position || DEFAULT_CENTER}
        zoom={MAP_CONFIG.defaultZoom}
        className="h-full w-full"
        zoomControl={false}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        maxBounds={ANGOLA_BOUNDS}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <LocationMarker position={position} setPosition={setPosition} />
        )}
        {position && <MapController position={position} />}
      </LeafletMapContainer>
    </div>
  );
}