'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Hero from './hero';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  groupItemsByCategory,
  getPriorityItems,
  formatCountryName,
} from '../utils';
import { CountryImage } from './country-image';
import { useCountryImages } from '../hooks/use-country-images';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useDebounce } from '@/lib/utils/hooks/useDebounce';
import { GlobalStats } from './hero';

interface CountryCardListProps {
  initialData: [string, { item: string; price: number }[]][];
  currentPage: number;
  totalPages: number;
  rowsPerPage?: number;
  imageMap: Record<string, string>;
  searchCountry: (query: string) => Promise<
    [
      string,
      {
        item: string;
        price: number;
      }[]
    ][]
  >;
  stats: GlobalStats;
}

export const CategoryItems = ({
  items,
}: {
  items: { emoji: string; item: string; price: number }[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ITEMS_TO_SHOW = 4;
  const hasMoreItems = items.length > ITEMS_TO_SHOW;
  const displayedItems = isExpanded ? items : items.slice(0, ITEMS_TO_SHOW);

  return (
    <div className="p-4 space-y-2">
      {displayedItems.map((item, index) => (
        <div key={index} className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="text-base" role="img" aria-label={item.item}>
              {item.emoji}
            </span>
            {item.item}
          </span>
          <Badge variant="secondary" className="font-mono">
            ${item.price.toFixed(2)}
          </Badge>
        </div>
      ))}

      {hasMoreItems && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2">
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show {items.length - ITEMS_TO_SHOW} More{' '}
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </span>
        </Button>
      )}
    </div>
  );
};

export default function CountryCardList({
  initialData,
  currentPage,
  totalPages,
  imageMap,
  searchCountry,
  stats,
}: CountryCardListProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const countries = data.map(([country]) => country);

  const { images, isLoading } = useCountryImages(countries, imageMap);
  const getCountryImage = (country: string): string =>
    images[country] || '/images/placeholder.jpg';

  const [selectedCountry, setSelectedCountry] = useState<null | {
    country: string;
    items: { item: string; price: number }[];
  }>(null);

  const handlePageChange = async (page: number) => {
    if (page > 0 && page <= totalPages) {
      await router.push(`/cost-of-living?page=${page}`, {
        scroll: false,
      });
    }
  };

  const handleSearchTermChange = (val: string) => {
    setSearchTerm(val);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedSearchTerm.trim()) {
        setData(initialData);
        setIsSearchActive(false);
        return;
      }
      setIsSearchActive(true);
      try {
        const filtered = await searchCountry(debouncedSearchTerm);
        setData(filtered);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsSearchActive(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm, initialData, searchCountry]);

  return (
    <>
      <Hero stats={stats} onSearchTermChange={handleSearchTermChange} />
      {isSearchActive && <p className="text-center">Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(([country, items]) => {
          const priorityItems = getPriorityItems(items);
          return (
            <Card
              key={country}
              className="flex flex-col h-full shadow-lg hover:shadow-2xl transition-shadow duration-200 cursor-zoom-in"
              onClick={() => setSelectedCountry({ country, items })}
            >
              <CountryImage
                src={getCountryImage(country)}
                alt={`${country} landscape`}
                isLoading={isLoading}
              />
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

      {/* Conditional Pagination */}
      {!isSearchActive && (
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
      )}

      {/* Modal */}
      <Dialog
        open={!!selectedCountry}
        onOpenChange={() => setSelectedCountry(null)}
      >
        <DialogContent className="max-w-4xl w-full h-[90vh] overflow-hidden p-0">
          {selectedCountry && (
            <>
              <div className="relative w-full h-48">
                <Image
                  src={getCountryImage(selectedCountry.country)}
                  alt={`${selectedCountry.country} landscape`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-3xl font-bold text-white">
                    {formatCountryName(selectedCountry.country)}
                  </h2>
                </div>
              </div>
              {/* Main Content */}
              <div className="flex flex-col h-[calc(90vh-12rem)]">
                <DialogHeader className="px-6 py-4 border-b">
                  <DialogTitle>Cost of Living Details</DialogTitle>
                  <DialogDescription>
                    Explore detailed costs in{' '}
                    {formatCountryName(selectedCountry.country)}
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1">
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {Object.entries(groupItemsByCategory(selectedCountry.items))
                      .sort((a, b) => {
                        const order = [
                          'Rent Per Month',
                          'Utilities (Monthly)',
                          'Markets',
                          'Restaurants',
                          'Transportation',
                          'Sports And Leisure',
                          'Clothing And Shoes',
                          'Childcare',
                          'Salaries And Financing',
                          'Other',
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
