import { Suspense } from 'react';
import { fetchPaginatedGroupedData } from '@/lib/db/fetch-paginated-data';
import CountryCardList from './components/country-card-list';
import { getCountryImage } from '@/app/countries/_actions/get-country-image.action';
import { searchCountry } from './_actions/search-country.action';
import { getGlobalStatistics } from './_actions/get-global-statistics.action';

export default async function CostOfLivingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = parseInt((await searchParams).page || '1', 10);

  const [{ data, totalRows }, stats] = await Promise.all([
    fetchPaginatedGroupedData(page, 6),
    getGlobalStatistics(),
  ]);

  // Fetch images in parallel
  const countries = data.map(([country]) => country);
  const imagePromises = countries.map(async (country) => {
    const image = await getCountryImage(country);
    return [country, image] as [string, string];
  });

  const imageEntries = await Promise.all(imagePromises);
  const imageMap = Object.fromEntries(imageEntries);

  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[400px] bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      }
    >
      <CountryCardList
        initialData={data}
        currentPage={page}
        totalPages={Math.ceil(totalRows / 6)}
        rowsPerPage={6}
        imageMap={imageMap}
        searchCountry={searchCountry}
        stats={stats}
      />
    </Suspense>
  );
}
