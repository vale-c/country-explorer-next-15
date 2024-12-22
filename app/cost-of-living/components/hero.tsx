"use client";
import { Input } from "@/components/ui/input";

export default function Hero({
  searchCountry,
}: {
  searchCountry: (query: string) => Promise<
    [
      string,
      {
        item: string;
        price: number;
      }[]
    ][]
  >;
}) {
  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      {/* Hero Section */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
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
      {/* <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Global Rent Avg
          </h2>
          <p className="text-2xl font-bold text-blue-500">$900</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Internet Speed
          </h2>
          <p className="text-2xl font-bold text-green-500">60 Mbps</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Developer Happiness
          </h2>
          <p className="text-2xl font-bold text-yellow-500">8.5/10</p>
        </div>
      </section> */}

      {/* Country Cards Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Cost of Living by Country
        </h2>
      </section>
    </div>
  );
}
