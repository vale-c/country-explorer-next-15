'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
  ),
});

interface MapWrapperProps {
  lat: number;
  lon: number;
  popupContent?: string;
}

export function MapWrapper({ lat, lon, popupContent }: MapWrapperProps) {
  return <Map lat={lat} lon={lon} popupContent={popupContent} />;
}
