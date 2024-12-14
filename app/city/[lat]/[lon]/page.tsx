import { notFound } from 'next/navigation'
import { getCityDetails } from '@/lib/api'
import { CityDetails } from '@/components/city-details'

interface CityPageProps {
  params: { lat: string; lon: string }
}

export default async function CityPage({ params }: CityPageProps) {
  const lat = parseFloat(params.lat)
  const lon = parseFloat(params.lon)

  if (isNaN(lat) || isNaN(lon)) {
    console.error("Invalid coordinates:", params.lat, params.lon)
    notFound()
  }

  const cityDetails = await getCityDetails(lat, lon)

  if (!cityDetails) {
    notFound()
  }

  return <CityDetails cityDetails={cityDetails} />
}
