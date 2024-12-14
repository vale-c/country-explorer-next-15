import { notFound } from "next/navigation";
import { getCityDetails } from "@/lib/api";
import { CityDetails } from "@/components/city-details";

interface CityPageProps {
  params: Promise<{ lat: string; lon: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { lat, lon } = await params;

  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);

  if (isNaN(parsedLat) || isNaN(parsedLon)) {
    console.error("Invalid coordinates:", lat, lon);
    notFound();
  }

  const cityDetails = await getCityDetails(parsedLat, parsedLon);

  if (!cityDetails) {
    notFound();
  }

  return <CityDetails cityDetails={cityDetails} />;
}
