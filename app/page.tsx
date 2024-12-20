import { getCountries } from '@/lib/api';
import { CountryList } from '@/components/country-list';
import { Country } from '@/types/country';
import { CountrySearch } from '@/components/country-search';
import { InteractiveMap } from '@/components/interactive-map';

export default async function CountriesPage() {
  const countries: Country[] = await getCountries();

  return (
    <div className="container mx-auto">
      <div className="relative mb-4 md:mb-6 lg:mb-8 -mt-2 md:-mt-4">
        <InteractiveMap />
      </div>
      <h1 className="text-4xl font-bold mb-6">Countries</h1>
      <CountrySearch />
      <div className="my-6">
        {countries.length > 0 ? (
          <CountryList countries={countries} />
        ) : (
          <p className="text-red-500">Failed to load countries.</p>
        )}
      </div>
    </div>
  );
}
