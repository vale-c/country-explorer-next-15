"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface CountryCardListProps {
  data: [string, { item: string; price: number }[]][];
  currentPage: number;
  totalPages: number;
  rowsPerPage?: number;
}

/**
 * Formats a country name by replacing underscores with spaces
 * and capitalizing each word.
 *
 * @param {string} countryName - The raw country name (e.g., "New_Zealand").
 * @returns {string} - The formatted country name (e.g., "New Zealand").
 */
function formatCountryName(countryName: string): string {
  return countryName
    .split("_") // Split by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join the words with spaces
}

export default function CountryCardList({
  data,
  currentPage,
  totalPages,
}: CountryCardListProps) {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<null | {
    country: string;
    items: { item: string; price: number }[];
  }>(null);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      router.push(`/cost-of-living?page=${page}`);
    }
  };

  const emojiMap: Record<string, string> = {
    // Food items
    apples: "🍎",
    banana: "🍌",
    oranges: "🍊",
    tomato: "🍅",
    potato: "🥔",
    onion: "🧅",
    lettuce: "🥬",
    milk: "🥛", // Milk (1 liter)
    "loaf of fresh white bread": "🍞", // Fresh white bread
    rice: "🍚", // White rice (1kg)
    eggs: "🥚", // Eggs (12)
    "local cheese": "🧀", // Local cheese (1kg)
    "chicken fillets": "🍗", // Chicken fillets (1kg)
    "beef round": "🥩", // Beef round (or back leg red meat)

    // Beverages
    water: "💧",
    "bottle of wine": "🍷",
    "domestic beer": "🍺",
    "imported beer": "🍻",
    cappuccino: "☕",
    coke: "🥤", // Coke/Pepsi (bottles or cans)

    // Dining out
    "meal inexpensive restaurant": "🍴",
    "meal for 2 people mid-range restaurant": "🍷🍽️",
    "mcmeal at mcdonalds": "🍔🍟",

    // Transportation
    "one-way ticket": "🚌",
    "taxi start": "🚕",
    "taxi 1km": "🚖",
    "taxi 1hour waiting": "⏱️",

    // Fuel and vehicles
    gasoline: "⛽",
    "volkswagen golf": "🚗",
    "toyota corolla": "🚙",

    // Utilities and services
    "basic electricity heating cooling water garbage": "💡",
    "mobile phone monthly plan": "📱",
    internet: "🌐",

    // Fitness and entertainment
    "fitness club": "🏋️",
    "tennis court rent": "🎾",
    "cinema international release": "🎬",

    // Education
    school: "🏫",

    // Clothing
    "1 pair of jeans": "👖", // Jeans (e.g., Levi’s)
    "1 summer dress": "👗", // Summer dress (Zara, H&M)
    "1 pair of nike running shoes": "👟", // Nike running shoes
    "1 pair of men leather business shoes": "🥿", // Men's leather business shoes

    // Cigarettes
    "cigarettes 20 pack": "🚬",

    // Housing and utilities
    "apartment 1 bedroom in city centre": "🏙️", // 1-bedroom apartment (city center)
    "apartment 1 bedroom outside of centre": "🏡", // 1-bedroom apartment (outside center)
    "apartment 3 bedrooms in city centre": "🏢", // 3-bedroom apartment (city center)
    "apartment 3 bedrooms outside of centre": "🏠", // 3-bedroom apartment (outside center)
    "price per square meter to buy apartment in city centre": "🏗️", // Price per square meter in city center
    "price per square meter to buy apartment outside of centre": "🏘️", // Price per square meter outside center

    // Financial
    "average monthly net salary": "💵", // Monthly salary (after tax)
    "mortgage interest rate": "📉", // Mortgage interest rate

    // Default fallback
    default: "📦",
  };

  /**
   * Returns the appropriate emoji for an item name using partial matching.
   * Falls back to the default emoji if no match is found.
   *
   * @param {string} itemName - The full name of the item.
   * @returns {string} - The emoji corresponding to the item name.
   */
  function getEmoji(itemName: string): string {
    // Normalize a string: lowercase, remove punctuation, trim spaces
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove non-alphanumeric characters
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .trim();

    // Normalize the item name
    const normalizedItem = normalize(itemName);

    // Find the best match in the emoji map
    let bestMatch = emojiMap.default; // Default emoji
    let bestMatchLength = 0; // Length of the best-matching key

    for (const key in emojiMap) {
      const normalizedKey = normalize(key);

      // Check if the normalized key is part of the normalized item name
      if (
        normalizedItem.includes(normalizedKey) &&
        normalizedKey.length > bestMatchLength
      ) {
        bestMatch = emojiMap[key];
        bestMatchLength = normalizedKey.length;
      }
    }

    return bestMatch;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(([country, items], index) => (
          <div key={index} className="flex flex-col h-full">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>{formatCountryName(country)}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-1">
                  {items.slice(0, 4).map((item, itemIndex) => (
                    <li key={itemIndex} className="flex justify-between">
                      <span>
                        {getEmoji(item.item)} {item.item}
                      </span>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-4">
                {items.length > 4 && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCountry({ country, items })}
                  >
                    View More
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Dialog for full details */}
      <Dialog
        open={!!selectedCountry}
        onOpenChange={() => setSelectedCountry(null)}
      >
        <DialogContent className="max-w-4xl w-full h-[80vh] overflow-hidden">
          {selectedCountry && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {formatCountryName(selectedCountry.country)}
                </DialogTitle>
                <DialogDescription>
                  Full cost-of-living statistics for{" "}
                  {formatCountryName(selectedCountry.country)}.
                </DialogDescription>
              </DialogHeader>
              {/* Scrollable content container */}
              <div className="space-y-2 mt-4 h-[calc(80vh-150px)] overflow-y-auto pr-2">
                <ul>
                  {selectedCountry.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>
                        {getEmoji(item.item)} {item.item}
                      </span>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <DialogFooter>
                <Button onClick={() => setSelectedCountry(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
