import { searchCity, searchCountries } from '@/lib/data';
import { CityList } from '@/app/city/_components/city-list';
import { CountryList } from '@/app/countries/_components/country-list';

interface SearchPageProps {
  searchParams: Promise<{ q: string; country?: string; type: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, country, type } = await searchParams;

  let results = [];
  let isCitySearch = false;

  if (type === 'city') {
    isCitySearch = true;
    results = await searchCity(`${q}, ${country}`);
  } else if (type === 'country') {
    results = await searchCountries(q);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Search Results</h1>
      {results.length > 0 ? (
        isCitySearch ? (
          <CityList cities={results} />
        ) : (
          <CountryList countries={results} />
        )
      ) : (
        <p className="text-center text-red-500">
          No results found. Please try a different search.
        </p>
      )}
    </div>
  );
}
