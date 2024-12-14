import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Country } from "@/types/country";
import { CitySearch } from "@/components/city-search";

interface CountryDetailsProps {
  country: Country;
}

export function CountryDetails({ country }: CountryDetailsProps) {
  return (
    <article className="space-y-8">
      <header className="flex items-center space-x-4">
        <Image
          src={country.flags.svg}
          alt={`${country.name.common} flag`}
          width={80}
          height={60}
          className="rounded-md"
        />
        <h1 className="text-4xl font-bold">{country.name.common}</h1>
      </header>
      <CitySearch countryCode={country.cca2} />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">Capital:</dt>
                <dd>{country.capital?.[0] || "N/A"}</dd>
              </div>
              <div>
                <dt className="font-semibold">Region:</dt>
                <dd>{country.region}</dd>
              </div>
              <div>
                <dt className="font-semibold">Subregion:</dt>
                <dd>{country.subregion}</dd>
              </div>
              <div>
                <dt className="font-semibold">Population:</dt>
                <dd>{country.population.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-semibold">Area:</dt>
                <dd>{country.area.toLocaleString()} km²</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.values(country.languages || {}).map((language) => (
                <div key={language} className="text-sm">
                  {language}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Currencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.values(country.currencies || {}).map(
                (currency: { name: string; symbol: string }) => (
                  <div key={currency.name} className="text-sm">
                    {currency.name} ({currency.symbol})
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </article>
  );
}
