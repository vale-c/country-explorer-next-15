import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Country } from '@/types/country'
import { CitySearch } from '@/components/city-search'

interface CountryDetailsProps {
  country: Country
}

export function CountryDetails({ country }: CountryDetailsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Image
          src={country.flags.svg}
          alt={`${country.name.common} flag`}
          width={80}
          height={60}
          className="rounded-md"
        />
        <h1 className="text-4xl font-bold">{country.name.common}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Capital: {country.capital?.[0] || 'N/A'}</p>
            <p>Region: {country.region}</p>
            <p>Subregion: {country.subregion}</p>
            <p>Population: {country.population.toLocaleString()}</p>
            <p>Area: {country.area.toLocaleString()} km²</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {Object.values(country.languages || {}).map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Currencies</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {Object.values(country.currencies || {}).map((currency: { name: string; symbol: string }) => (
                <li key={currency.name}>
                  {currency.name} ({currency.symbol})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <CitySearch countryCode={country.cca2} />
    </div>
  )
}
