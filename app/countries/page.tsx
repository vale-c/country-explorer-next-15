import { CountryList } from './_components/country-list';
import { Country } from '@/types/country';
import { getCountries } from '@/lib/data';

import { CountrySearch } from './_components/country-search';

export default async function CountriesPage() {
  const countries: Country[] = await getCountries();

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
      <CountrySearch />
      <div className="my-6">
        {countries.length > 0 ? (
          <CountryList countries={countries} />
        ) : (
          <p className="text-red-500">Failed to load countries.</p>
        )}
      </div>
    </main>
  );
}
