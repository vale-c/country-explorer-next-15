import { Suspense } from "react";
import { fetchPaginatedGroupedCitiesData } from "@/lib/db/fetch-all-cities-data";
import CityCardList from "./components/city-card-list";
import { getCountryImages } from "../page";

export default async function CityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = parseInt((await searchParams).page || "1", 10);

  const [{ data, totalRows }] = await Promise.all([
    fetchPaginatedGroupedCitiesData(page, 9),
  ]);

  const cities = data.map(([city]) => city);
  const imageMap = await getCountryImages(cities);

  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
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
        totalPages={Math.ceil(totalRows / 9)}
      />
    </Suspense>
  );
}
