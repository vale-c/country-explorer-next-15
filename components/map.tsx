'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  lat: number;
  lon: number;
  popupContent?: string;
}

export default function Map({ lat, lon, popupContent }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView([lat, lon], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    // Add marker
    const icon = new L.Icon({
      iconUrl: '/leaflet/images/marker-icon.png',
      iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
      shadowUrl: '/leaflet/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const marker = L.marker([lat, lon], { icon }).addTo(mapRef.current);
    if (popupContent) {
      marker.bindPopup(popupContent);
    }

    // Cleanup
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lon, popupContent]);

  return <div ref={mapContainerRef} className="h-[400px] w-full rounded-lg" />;
}
