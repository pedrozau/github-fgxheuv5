import { LatLngBounds, LatLng } from 'leaflet';

// Angola's approximate bounds
export const ANGOLA_BOUNDS = new LatLngBounds(
  new LatLng(-18.038239, 11.679219), // Southwest
  new LatLng(-4.376226, 24.082031)   // Northeast
);

// Default center (Luanda)
export const DEFAULT_CENTER = new LatLng(-8.8383333, 13.2344444);

// Map configuration
export const MAP_CONFIG = {
  minZoom: 5,
  maxZoom: 18,
  defaultZoom: 6,
};