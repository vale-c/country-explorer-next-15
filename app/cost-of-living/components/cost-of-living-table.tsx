"use client";

import { useRouter } from "next/navigation";

interface CostOfLivingTableProps {
  data: { item: string; country: string; price: number }[];
  currentPage: number;
  totalPages: number;
}

export default function CostOfLivingTable({
  data,
  currentPage,
  totalPages,
}: CostOfLivingTableProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      router.push(`/cost-of-living/${page}`);
    }
  };

  return (
    <>
      <table className="w-full border-collapse border border-gray-200 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Item</th>
            <th className="border border-gray-300 p-2">Country</th>
            <th className="border border-gray-300 p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{row.item}</td>
              <td className="border border-gray-300 p-2">{row.country}</td>
              <td className="border border-gray-300 p-2">
                ${row.price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
