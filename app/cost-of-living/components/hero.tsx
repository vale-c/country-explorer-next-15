'use client';
import { Input } from '@/components/ui/input';

interface GlobalStats {
  averageRentCityCenter: number;
  averageInternetSpeed: number;
  averageCoffeePrice: number;
  totalCountries: number;
}

export default function Hero({
  searchCountry,
  stats,
}: {
  searchCountry: (
    query: string
  ) => Promise<[string, { item: string; price: number }[]][]>;
  stats: GlobalStats;
}) {
  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      {/* Hero Section */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4 relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
          Discover the Best Places to Work and Live
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Compare cost of living, internet speeds, and lifestyle metrics to
          choose your next destination as a software engineer.
        </p>
        <div className="flex justify-center">
          <Input
            type="text"
            placeholder="Search for a country or city..."
            className="w-96 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={(e) => searchCountry(e.target.value)}
          />
        </div>
      </section>

      {/* Global Metrics Section */}
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-black shadow-lg rounded-lg p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Global Rent Avg
          </h2>
          <p className="text-2xl font-bold text-blue-500">
            ${stats.averageRentCityCenter}
          </p>
        </div>
        <div className="bg-white dark:bg-black shadow-lg rounded-lg p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Internet Cost
          </h2>
          <p className="text-2xl font-bold text-green-500">
            ${stats.averageInternetSpeed}
          </p>
        </div>
        <div className="bg-white dark:bg-black shadow-lg rounded-lg p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Coffee Index
          </h2>
          <p className="text-2xl font-bold text-yellow-500">
            ${stats.averageCoffeePrice}
          </p>
        </div>
      </section>

      {/* Country Cards Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Cost of Living by Country
        </h2>
      </section>
    </div>
  );
}
