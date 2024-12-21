import { db } from "@/drizzle.config";
import { costOfLiving } from "@/lib/db/schema";

export async function fetchPaginatedGroupedData(
  page: number,
  rowsPerPage: number
) {
  const offset = (page - 1) * rowsPerPage;

  // Fetch all data grouped by country
  const data = await db.select().from(costOfLiving);

  // Group by country
  const groupedData = data.reduce((acc, row) => {
    if (!acc[row.country]) {
      acc[row.country] = [];
    }
    acc[row.country].push({
      item: row.item,
      price: parseFloat(row.price as unknown as string),
    });
    return acc;
  }, {} as Record<string, { item: string; price: number }[]>);

  const groupedCountries = Object.entries(groupedData);

  // Paginate grouped countries
  const paginatedCountries = groupedCountries.slice(
    offset,
    offset + rowsPerPage
  );

  return {
    data: paginatedCountries,
    totalRows: groupedCountries.length,
  };
}
