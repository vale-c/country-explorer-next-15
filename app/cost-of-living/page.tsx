import { fetchPaginatedGroupedData } from '@/lib/db/fetch-paginated-data';
import CountryCardList from './components/country-card-list';
import { getCountryImage } from '@/app/countries/_actions/get-country-image.action';
import { searchCountry } from './_actions/search-country.action';
import { getGlobalStatistics } from './_actions/get-global-statistics.action';
import { unstable_cache } from 'next/cache';

const getCountryImages = unstable_cache(
  async (countries: string[]) => {
    const imageMap: Record<string, string> = {};
    await Promise.all(
      countries.map(async (country) => {
        const image = await getCountryImage(country);
        imageMap[country] = image;
      })
    );
    return imageMap;
  },
  ['country-images'],
  { revalidate: 86400 }
);

export default async function CostOfLivingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ data, totalRows }, stats] = await Promise.all([
    fetchPaginatedGroupedData(
      parseInt((await searchParams).page || '1', 10),
      6
    ),
    getGlobalStatistics(),
  ]);

  const countries = data.map(([country]) => country);
  const imageMap = await getCountryImages(countries);

  return (
    <CountryCardList
      initialData={data}
      currentPage={parseInt((await searchParams).page || '1', 10)}
      totalPages={Math.ceil(totalRows / 6)}
      rowsPerPage={6}
      imageMap={imageMap}
      searchCountry={searchCountry}
      stats={stats}
    />
  );
}
