"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CountryCardListProps {
  data: [string, { item: string; price: number }[]][];
  currentPage: number;
  totalPages: number;
  rowsPerPage?: number;
  imageMap: Record<string, string | null>;
}

function formatCountryName(countryName: string): string {
  return countryName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const PRIORITY_ITEMS = [
  { item: "Apartment (1 bedroom) in City Centre", emoji: "🏙️" },
  { item: "Meal, Inexpensive Restaurant", emoji: "🍽️" },
  {
    item: "Internet (60 Mbps or More, Unlimited Data, Cable/ADSL)",
    emoji: "🌐",
  },
  { item: "One-way Ticket (Local Transport)", emoji: "🚌" },
];

function getPriorityItems(
  items: { item: string; price: number }[]
): { item: string; price: number; emoji: string }[] {
  return PRIORITY_ITEMS.map(({ item, emoji }) => {
    const matchingItem = items.find((i) => i.item === item);
    return matchingItem ? { ...matchingItem, emoji } : null;
  }).filter(Boolean) as { item: string; price: number; emoji: string }[];
}

// Updated category map optimized for nomads
const categoryMap: Record<string, { emoji: string; category: string }> = {
  // Housing
  "apartment 1 bedroom in city centre": { emoji: "🏙️", category: "Housing" },
  "apartment 1 bedroom outside of centre": { emoji: "🏡", category: "Housing" },
  "apartment 3 bedrooms in city centre": { emoji: "🏢", category: "Housing" },
  "apartment 3 bedrooms outside of centre": {
    emoji: "🏠",
    category: "Housing",
  },

  // Food & Drinks
  milk: { emoji: "🥛", category: "Food & Drinks" },
  cappuccino: { emoji: "☕", category: "Food & Drinks" },
  "bottle of wine": { emoji: "🍷", category: "Food & Drinks" },
  "meal inexpensive restaurant": { emoji: "🍽️", category: "Food & Drinks" },
  "meal for 2 people mid-range restaurant": {
    emoji: "🍷🍴",
    category: "Food & Drinks",
  },

  // Transportation
  "one-way ticket": { emoji: "🚌", category: "Transportation" },
  gasoline: { emoji: "⛽", category: "Transportation" },
  "taxi start": { emoji: "🚕", category: "Transportation" },
  "monthly pass": { emoji: "🛴", category: "Transportation" },

  // Utilities
  internet: { emoji: "🌐", category: "Utilities" },
  "basic electricity heating cooling water garbage": {
    emoji: "💡",
    category: "Utilities",
  },

  // Entertainment & Fitness
  "fitness club": { emoji: "🏋️", category: "Entertainment & Fitness" },
  "cinema international release": {
    emoji: "🎬",
    category: "Entertainment & Fitness",
  },

  // Other Costs (limited to 4 items)
  "1 pair of jeans": { emoji: "👖", category: "Other Costs" },
  "1 pair of nike running shoes": { emoji: "👟", category: "Other Costs" },
  "1 summer dress in a chain store": { emoji: "👗", category: "Other Costs" },
  "mobile phone monthly plan": { emoji: "📱", category: "Other Costs" },

  // Default
  default: { emoji: "📦", category: "Other Costs" },
};

function getCategory(itemName: string): { emoji: string; category: string } {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim();

  const normalizedItem = normalize(itemName);

  for (const key in categoryMap) {
    const normalizedKey = normalize(key);
    if (normalizedItem.includes(normalizedKey)) {
      return categoryMap[key];
    }
  }

  return categoryMap.default;
}

export default function CountryCardList({
  data,
  currentPage,
  totalPages,
  imageMap,
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

  const getCountryImage = (country: string): string =>
    imageMap[country] || "/placeholder.jpg";

  const optimizedCategoryOrder = [
    "Housing",
    "Food & Drinks",
    "Transportation",
    "Utilities",
    "Entertainment & Fitness",
    "Other Costs",
  ];

  const groupItemsByCategory = (
    items: { item: string; price: number }[]
  ): Record<string, { emoji: string; item: string; price: number }[]> => {
    const grouped: Record<
      string,
      { emoji: string; item: string; price: number }[]
    > = {};

    const uniqueItems = items.filter(
      (item, index, self) =>
        index === self.findIndex((i) => i.item === item.item)
    );

    uniqueItems.forEach((item) => {
      const { emoji, category } = getCategory(item.item);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push({ emoji, item: item.item, price: item.price });
    });

    // Limit "Other Costs" to 4 items max
    if (grouped["Other Costs"]?.length > 4) {
      grouped["Other Costs"] = grouped["Other Costs"].slice(0, 4);
    }

    return grouped;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(([country, items], index) => {
          const priorityItems = getPriorityItems(items);
          return (
            <Card
              key={index}
              className="flex flex-col h-full shadow-lg hover:shadow-2xl transition-shadow duration-200 cursor-zoom-in"
              onClick={() => setSelectedCountry({ country, items })}
            >
              <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                <Image
                  src={getCountryImage(country)}
                  alt={`${country} landscape`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader>
                <CardTitle className="mt-4 text-center text-xl font-semibold">
                  {formatCountryName(country)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {priorityItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex justify-between">
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

      {/* Pagination */}
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

      {/* Modal */}
      <Dialog
        open={!!selectedCountry}
        onOpenChange={() => setSelectedCountry(null)}
      >
        <DialogContent className="max-w-4xl w-full h-[90vh] overflow-hidden p-0">
          {selectedCountry && (
            <>
              {/* Country Image */}
              <div className="relative w-full h-48 -mt-6">
                <Image
                  src={getCountryImage(selectedCountry.country)}
                  alt={`${selectedCountry.country} landscape`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>

              {/* Modal Header */}
              <DialogHeader className="flex-shrink-0 px-6 py-4">
                <DialogTitle className="text-2xl font-bold">
                  {formatCountryName(selectedCountry.country)}
                </DialogTitle>
              </DialogHeader>

              {/* Scrollable Content */}
              <div className="flex-grow overflow-y-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {optimizedCategoryOrder.map((category) => {
                    const items = groupItemsByCategory(selectedCountry.items)[
                      category
                    ];
                    if (!items) return null;

                    return (
                      <div key={category}>
                        <h3 className="text-xl font-semibold mb-2 flex items-center">
                          {items[0]?.emoji || "📦"} {category}
                        </h3>
                        <ul className="space-y-1">
                          {items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{item.item}</span>
                              <span>${item.price.toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="flex-shrink-0 px-6 py-4">
                <Button onClick={() => setSelectedCountry(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
