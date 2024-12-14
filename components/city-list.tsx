import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CityData } from '@/types/city'

interface CityListProps {
  cities: CityData[]
}

export function CityList({ cities }: CityListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city) => (
        <Link href={`/city/${city.lat}/${city.lon}`} key={city.place_id}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{city.display_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Latitude: {city.lat}</p>
              <p>Longitude: {city.lon}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
