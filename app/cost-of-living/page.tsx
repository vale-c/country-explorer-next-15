import { Suspense } from 'react';
import CountryCardList from './_components/country-card-list';
import { getCountryImage } from '@/lib/data';
import { searchCountry } from '@/lib/data';
import {
  fetchGlobalStatistics,
  fetchPaginatedGroupedCountryData,
} from '@/lib/data';

async function getCountryImages(countries: string[]) {
  const imageMap: Record<string, string> = {};
  await Promise.all(
    countries.map(async (country) => {
      const image = await getCountryImage(country);
      imageMap[country] = image;
    })
  );
  return imageMap;
}

export default async function CostOfLivingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = parseInt((await searchParams).page || '1', 10);

  // Server component data fetching
  const [{ data, totalRows }, stats] = await Promise.all([
    fetchPaginatedGroupedCountryData(page, 15),
    fetchGlobalStatistics(),
  ]);

  const countries = data.map(([country]) => country);
  const imageMap = await getCountryImages(countries);

  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
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
        totalPages={Math.ceil(totalRows / 15)}
        rowsPerPage={15}
        imageMap={imageMap}
        searchCountry={searchCountry}
        stats={stats}
      />
    </Suspense>
  );
}
