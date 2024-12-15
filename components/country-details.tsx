"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Country, QualityOfLife } from "@/types/country";
import { CitySearch } from "@/components/city-search";

interface CountryDetailsProps {
  country: Country;
  qualityOfLife: QualityOfLife;
}

export function CountryDetails({
  country,
  qualityOfLife,
}: CountryDetailsProps) {
  const [countryImage, setCountryImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const getCountryImage = async () => {
      try {
        const response = await fetch(
          `/api/unsplash?query=${encodeURIComponent(country.name.common)}`
        );
        if (!response.ok) throw new Error("Failed to fetch image");

        const data = await response.json();
        setCountryImage(data.imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    getCountryImage();
  }, [country.name.common]);

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
            alt={`${country.name?.common ?? "Unknown"} landscape`}
            fill
            className="object-cover"
            priority
          />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            {country.name?.common ?? "Unknown"}
          </h1>
          <p className="text-white/80 text-xl">
            {country.name?.official ?? "Unknown"}
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
              <TabsTrigger value="economy">Economy</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
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
                            {country.population?.toLocaleString() ?? "N/A"}
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
                            {country.region ?? "Unknown"} (
                            {country.subregion ?? "Unknown"})
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Capital
                          </p>
                          <p className="font-medium">
                            {country.capital?.[0] ?? "N/A"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Cost of Living
                          </p>
                          <p className="text-lg font-bold">
                            {qualityOfLife.costOfLiving}/100
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Safety
                          </p>
                          <p className="text-lg font-bold">
                            {qualityOfLife.safety}/100
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <Heart className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Healthcare
                          </p>
                          <p className="text-lg font-bold">
                            {qualityOfLife.healthcare}/100
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <BookOpen className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Education
                          </p>
                          <p className="text-lg font-bold">
                            {qualityOfLife.education}/100
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <Wifi className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Internet Speed
                          </p>
                          <p className="text-lg font-bold">
                            {qualityOfLife.internetSpeed} Mbps
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Life Expectancy
                          </p>
                          <p className="text-lg font-bold">
                            {qualityOfLife.lifeExpectancy} years
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Economy Tab Content */}
                <TabsContent value="economy" className="space-y-6">
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
                          ${qualityOfLife.gdpPerCapita.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          GDP per capita is the total economic output of a
                          country divided by its population. It provides an
                          average economic productivity per person and is often
                          used as an indicator of the economic health of a
                          country.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tourism Receipts (current US$)
                        </p>
                        <p className="text-2xl font-bold">
                          ${qualityOfLife.tourismReceipts.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tourism receipts represent the total income generated
                          from international tourism in the country. This
                          includes all spending by foreign visitors on goods and
                          services, such as accommodation, food, entertainment,
                          and transportation, and is a key indicator of a
                          country&apos;s attractiveness to visitors.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Geography Tab Content */}
                <TabsContent value="geography" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cities</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CitySearch countryCode={country.cca2} />
                    </CardContent>
                  </Card>
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
                          {country.area?.toLocaleString() ?? "N/A"} km²
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Coordinates
                        </p>
                        <p className="font-medium">
                          {country.latlng?.[0]?.toFixed(2) ?? "0.00"}°N,{" "}
                          {country.latlng?.[1]?.toFixed(2) ?? "0.00"}°E
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Coastline
                        </p>
                        <p className="font-medium">
                          {country.landlocked
                            ? "This country is landlocked"
                            : "This country has access to the sea"}
                        </p>
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
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Image
                  src={country.flags?.svg ?? "/default-flag.svg"}
                  alt={`${country.name?.common ?? "Unknown"} flag`}
                  width={40}
                  height={30}
                  className="mr-2"
                />
                <p className="font-medium capitalize">{country.name?.common}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Driving Side</p>
                <p className="font-medium capitalize">
                  {country.car?.side ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country Code</p>
                <p className="font-medium">
                  {country.cca2 ?? "N/A"} / {country.cca3 ?? "N/A"}
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
