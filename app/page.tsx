import { getCountries } from "@/lib/api"
import { CountryList } from "@/components/country-list"
import { Country } from "@/types/country"

export default async function CountriesPage() {
  const countries: Country[] = await getCountries()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Countries</h1>
      {countries.length > 0 ? (
        <CountryList countries={countries} />
      ) : (
        <p className="text-red-500">Failed to load countries.</p>
      )}
    </div>
  )
}
