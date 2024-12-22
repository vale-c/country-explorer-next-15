import { fetchPaginatedGroupedData } from "@/lib/db/fetch-paginated-data";
import CountryCardList from "./components/country-card-list";
import { getCountryImage } from "@/app/countries/_actions/get-country-image.action";
import { searchCountry } from "./_actions/search-country.action";

export default async function CostOfLivingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const rowsPerPage = 6; // Number of countries per page
  const { data, totalRows } = await fetchPaginatedGroupedData(
    currentPage,
    rowsPerPage
  );
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const imageMap: Record<string, string | null> = {};

  // Fetch images for each country in parallel
  await Promise.all(
    data.map(async ([country]) => {
      const image = await getCountryImage(country);
      imageMap[country] = image || "/images/placeholder.png";
    })
  );

  return (
    <CountryCardList
      initialData={data}
      currentPage={currentPage}
      totalPages={totalPages}
      rowsPerPage={rowsPerPage}
      imageMap={imageMap}
      searchCountry={searchCountry}
    />
  );
}
