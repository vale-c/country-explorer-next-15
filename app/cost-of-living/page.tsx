import { fetchPaginatedGroupedData } from "@/lib/db/fetch-paginated-data";
import CountryCardList from "./components/country-card-list";

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

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Cost of Living by Country</h1>
      <CountryCardList
        data={data}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
}
