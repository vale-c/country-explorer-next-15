'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Users,
  Shield,
  DollarSign,
  BookOpen,
  Heart,
  Wifi,
  Mountain,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Country, QualityOfLife } from '@/types/country';
import { CitySearch } from './city-search';
import { decimalFormatter } from '@/lib/utils/formatters';
import { FormattedNumber } from '@/components/server/formatted-number';

interface CountryDetailsProps {
  country: Country;
  qualityOfLife: QualityOfLife;
  countryImage: string | null;
}

interface InternetSpeeds {
  [key: string]: number;
}

export function CountryDetails({
  country,
  qualityOfLife,
  countryImage,
}: CountryDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [internetSpeed, setInternetSpeed] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternetSpeeds = async () => {
      try {
        const response = await fetch('/internet_speeds.json');
        if (!response.ok) {
          console.error(
            `Error fetching internet speeds: ${response.statusText}`
          );
          return;
        }

        const speeds: InternetSpeeds = await response.json();
        // Normalize the keys in the JSON to lowercase for easy comparison
        const normalizedSpeeds: InternetSpeeds = Object.fromEntries(
          Object.entries(speeds).map(([key, value]) => [
            key.toLowerCase().trim(),
            value,
          ])
        );
        // Normalize the country name to lowercase and trim spaces
        const normalizedCountryName = country.name.common.toLowerCase().trim();
        const speed = normalizedSpeeds[normalizedCountryName];

        if (speed !== undefined) {
          setInternetSpeed(decimalFormatter.format(speed));
        } else {
          setInternetSpeed(null);
        }
      } catch (error) {
        console.error(`Error loading internet speeds: ${error}`);
      }
    };

    fetchInternetSpeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[400px] rounded-xl overflow-hidden"
      >
        <Suspense
          fallback={<div className="bg-gray-300 h-[400px] rounded-xl" />}
        >
          <Image
            src={countryImage || country.flags?.svg}
            alt={`${country.name?.common ?? 'Unknown'} landscape`}
            fill
            className="object-cover"
            priority
          />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            {country.name?.common ?? 'Unknown'}
          </h1>
          <p className="text-white/80 text-xl">
            {country.name?.official ?? 'Unknown'}
          </p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="qualityOfLife">Quality of Life</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Overview Tab Content */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Demographics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Population
                          </p>
                          <p className="text-2xl font-bold">
                            <FormattedNumber value={country.population} />
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Languages
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.values(country.languages || {}).map(
                              (language) => (
                                <span
                                  key={language}
                                  className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                                >
                                  {language}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Region
                          </p>
                          <p className="font-medium">
                            {country.region ?? 'Unknown'} (
                            {country.subregion ?? 'Unknown'})
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Capital
                          </p>
                          <p className="font-medium">
                            {country.capital?.[0] ?? 'N/A'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Economy Tab Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Economic Indicators
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          GDP per capita (USD)
                        </p>
                        <p className="text-2xl font-bold">
                          $
                          <FormattedNumber value={qualityOfLife.gdpPerCapita} />
                        </p>
                        <p className="text-sm text-muted-foreground">
                          GDP per capita is the total economic output of a
                          country divided by its population. It provides an
                          average economic productivity per person and is often
                          used as an indicator of the economic health of a
                          country.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Geography Tab Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mountain className="h-5 w-5" />
                        Geography
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Area</p>
                        <p className="text-2xl font-bold">
                          <FormattedNumber value={country.area} /> km²
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Coordinates
                        </p>
                        <p className="font-medium">
                          <FormattedNumber
                            value={country.latlng?.[0] ?? 0}
                            maximumFractionDigits={2}
                            minimumFractionDigits={2}
                          />
                          °N,{' '}
                          <FormattedNumber
                            value={country.latlng?.[1] ?? 0}
                            maximumFractionDigits={2}
                            minimumFractionDigits={2}
                          />
                          °E
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Coastline
                        </p>
                        <p className="font-medium">
                          {country.landlocked
                            ? 'This country is landlocked'
                            : 'This country has access to the sea'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Quality of Life Tab Content */}
                <TabsContent value="qualityOfLife" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Quality of Life
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-black">
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Cost of Living
                          </p>
                          <p className="text-lg font-bold">
                            <FormattedNumber
                              value={qualityOfLife.costOfLiving}
                            />
                            /100
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-black">
                        <Heart className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Healthcare
                          </p>
                          <p className="text-lg font-bold">
                            <FormattedNumber value={qualityOfLife.healthcare} />
                            /100
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-black">
                        <BookOpen className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Education
                          </p>
                          <p className="text-lg font-bold">
                            <FormattedNumber value={qualityOfLife.education} />
                            /100
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-black">
                        <Wifi className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Internet Speed
                          </p>
                          <p className="text-lg font-bold">
                            {internetSpeed ? `${internetSpeed} Mbps` : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-black">
                        <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Life Expectancy
                          </p>
                          <p className="text-lg font-bold">
                            <FormattedNumber
                              value={qualityOfLife.lifeExpectancy}
                            />{' '}
                            years
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CitySearch countryCode={country.cca3} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Image
                  src={country.flags?.svg ?? '/default-flag.svg'}
                  alt={`${country.name?.common ?? 'Unknown'} flag`}
                  width={40}
                  height={30}
                  className="mr-2"
                />
                <p className="font-medium capitalize">{country.name?.common}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Driving Side</p>
                <p className="font-medium capitalize">
                  {country.car?.side ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country Code</p>
                <p className="font-medium">
                  {country.cca2 ?? 'N/A'} / {country.cca3 ?? 'N/A'}
                </p>
              </div>
              {country.tld && (
                <div>
                  <p className="text-sm text-muted-foreground">Internet TLD</p>
                  <div className="flex flex-wrap gap-2">
                    {country.tld.map((domain) => (
                      <span
                        key={domain}
                        className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </article>
  );
}
