import { notFound } from 'next/navigation';
import { getCityDetails } from '@/app/city/_actions/get-city-details.action';
import { CityDetails } from '@/app/city/city-details';
import { MapWrapper } from '@/components/map-wrapper';

interface CityPageProps {
  params: Promise<{ lat: string; lon: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { lat, lon } = await params;

  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);

  if (isNaN(parsedLat) || isNaN(parsedLon)) {
    console.error('Invalid coordinates:', lat, lon);
    notFound();
  }

  const cityDetails = await getCityDetails(parsedLat, parsedLon);

  if (!cityDetails) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <CityDetails cityDetails={cityDetails} />
      <MapWrapper
        lat={parsedLat}
        lon={parsedLon}
        popupContent={cityDetails.display_name}
      />
    </div>
  );
}
