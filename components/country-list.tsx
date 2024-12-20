'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Country } from '@/types/country';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { numberFormatter } from '@/lib/utils/formatters';

interface CountryListProps {
  countries: Country[];
}

export function CountryList({ countries }: CountryListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 25;

  // Calculate the indices for slicing the countries array
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = countries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  // Calculate total pages
  const totalPages = Math.ceil(countries.length / countriesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {indexOfFirstCountry + 1} to{' '}
          {Math.min(indexOfLastCountry, countries.length)} of {countries.length}{' '}
          countries
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCountries.map((country) => (
          <Link href={`/country/${country.cca3}`} key={country.cca3}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>
                  <Image
                    src={country.flags.svg}
                    alt={`${country.name.common} flag`}
                    width={32}
                    height={24}
                    className="w-8 h-6 mr-2 mb-3"
                  />
                  {country.name.common}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
                </p>
                <p>
                  <strong>Region:</strong> {country.region || 'N/A'}
                </p>
                <p>
                  <strong>Population:</strong>{' '}
                  {numberFormatter.format(country.population)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? 'default' : 'outline'}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
