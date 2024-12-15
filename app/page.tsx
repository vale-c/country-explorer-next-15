import { getCountries } from "@/lib/api";
import { CountryList } from "@/components/country-list";
import { Country } from "@/types/country";
import { CountrySearch } from "@/components/country-search";
import { InteractiveMap } from "@/components/interactive-map";

export default async function CountriesPage() {
  const countries: Country[] = await getCountries();

  return (
    <div className="container mx-auto">
      <div className="relative mb-8 h-[500px] md:h-[700px] overflow-hidden rounded-lg">
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
