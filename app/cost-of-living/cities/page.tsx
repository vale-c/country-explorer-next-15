import { Suspense } from 'react';
import { fetchPaginatedGroupedCitiesData, getCountryImage } from '@/lib/data';
import CityCardList from './_components/city-card-list';

async function getCityImage(cities: string[]) {
  const imageMap: Record<string, string> = {};
  await Promise.all(
    cities.map(async (city) => {
      const image = await getCountryImage(city);
      imageMap[city] = image;
    })
  );
  return imageMap;
}

export default async function CityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = parseInt((await searchParams).page || '1', 10);

  const [{ data, totalRows }] = await Promise.all([
    fetchPaginatedGroupedCitiesData(page, 15),
  ]);

  const cities = data.map(([city]) => city);
  const imageMap = await getCityImage(cities);

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
      <CityCardList
        initialData={data}
        imageMap={imageMap}
        currentPage={page}
        totalPages={Math.ceil(totalRows / 15)}
      />
    </Suspense>
  );
}
