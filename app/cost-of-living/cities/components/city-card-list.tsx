"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCountryImages } from "../../hooks/use-country-images";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CategoryItems } from "../../components/country-card-list";
import { CountryImage } from "../../components/country-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPriorityItems, groupItemsByCategory } from "../../utils";
import { Input } from "@/components/ui/input";
import { searchCity } from "../_actions/search-city.action";
import { useDebounce } from "@/lib/utils/hooks/useDebounce";

interface CityCardListProps {
  imageMap: Record<string, string>;
  initialData: [string, { item: string; price: number }[]][];
  currentPage: number;
  totalPages: number;
}

export default function CityCardList({
  imageMap,
  initialData,
  currentPage,
  totalPages,
}: CityCardListProps) {
  const router = useRouter();
  const itemsPerPage = 9; // Define the number of items per page
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filteredData, setFilteredData] = useState<
    [string, { item: string; price: number }[]][]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCity, setSelectedCity] = useState<null | {
    city: string;
    items: { item: string; price: number }[];
  }>(null);

  const cities = (searchTerm ? filteredData : data).map(([city]) => city);
  const { images, isLoading } = useCountryImages(cities, imageMap);

  // Update data only when initialData changes
  useEffect(() => {
    setData(initialData);
    setFilteredData(initialData);
  }, [initialData]);

  // Handle search logic
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchTerm.trim()) {
        setFilteredData(data); // Show unfiltered data if search term is empty
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const result = await searchCity(debouncedSearchTerm);
        setFilteredData(result); // Update filtered data based on search
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm, data]); // `data` here ensures filteredData resets when initialData changes

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = async (page: number) => {
    if (page > 0 && page <= totalPages) {
      await router.push(`/cost-of-living/cities?page=${page}`, {
        scroll: false,
      });
    }
  };

  const getCountryImage = (city: string): string =>
    images[city] || "/images/placeholder.jpg";

  // Calculate total pages dynamically for search results
  const dynamicTotalPages = searchTerm
    ? Math.ceil(filteredData.length / itemsPerPage)
    : totalPages;

  return (
    <>
      <section className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search for a city"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="text-sm text-gray-500 ml-4">
          {isSearching ? "Searching..." : `${filteredData.length} cities found`}
        </span>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map(([city, items]) => {
          const priorityItems = getPriorityItems(items);
          return (
            <Card
              key={city}
              className="flex flex-col h-full shadow-lg hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedCity({ city, items })}
            >
              <CountryImage
                src={getCountryImage(city)}
                alt={`${city}-landscape`}
                isLoading={isLoading}
              />
              <CardHeader>
                <CardTitle className="mt-4 text-center text-xl font-semibold">
                  {city}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {priorityItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {item.emoji} {item.item}
                      </span>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center items-center mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {dynamicTotalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === dynamicTotalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedCity} onOpenChange={() => setSelectedCity(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] overflow-hidden p-0">
          {selectedCity && (
            <>
              <div className="relative w-full h-48">
                <Image
                  src={getCountryImage(selectedCity.city)}
                  alt={`${selectedCity.city} landscape`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-3xl font-bold text-white">
                    {selectedCity.city}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col h-[calc(90vh-12rem)]">
                <DialogHeader className="px-6 py-4 border-b">
                  <DialogTitle>Cost of Living Details</DialogTitle>
                  <DialogDescription>
                    Explore detailed costs in {selectedCity.city}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1">
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {Object.entries(groupItemsByCategory(selectedCity.items))
                      .sort((a, b) => {
                        const order = [
                          "Rent Per Month",
                          "Utilities (Monthly)",
                          "Markets",
                          "Restaurants",
                          "Transportation",
                          "Sports And Leisure",
                          "Clothing And Shoes",
                          "Childcare",
                          "Salaries And Financing",
                          "Other",
                        ];
                        return order.indexOf(a[0]) - order.indexOf(b[0]);
                      })
                      .map(([category, items]) => (
                        <div
                          key={category}
                          className="bg-card rounded-lg border shadow-sm"
                        >
                          <div className="p-4 border-b bg-muted/50">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-2xl"
                                role="img"
                                aria-label={category}
                              >
                                {items[0]?.emoji}
                              </span>
                              <h3 className="text-lg font-semibold">
                                {category}
                              </h3>
                            </div>
                          </div>
                          <CategoryItems items={items} />
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
