import { searchCities } from '@/lib/api'
import { CityList } from '@/components/city-list'

interface SearchPageProps {
  searchParams: { q: string; country: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, country } = searchParams
  const cities = await searchCities(`${q}, ${country}`)

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Search Results</h1>
      {cities.length > 0 ? (
        <CityList cities={cities} />
      ) : (
        <p className="text-center text-red-500">No cities found. Please try a different search.</p>
      )}
    </div>
  )
}

