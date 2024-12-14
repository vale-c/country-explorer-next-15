"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Globe,
  Clock,
  Users,
  ArrowRight,
  ExternalLink,
  Mountain,
  Waves,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Country } from "@/types/country";
import { CitySearch } from "@/components/city-search";

interface CountryDetailsProps {
  country: Country;
}

export function CountryDetails({ country }: CountryDetailsProps) {
  return (
    <article className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[300px] rounded-xl overflow-hidden"
      >
        <Image
          src={country.flags.svg}
          alt={`${country.name.common} flag`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {country.name.common}
          </h1>
          <p className="text-white/80 text-xl">{country.name.official}</p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
              <TabsTrigger value="cities">Cities</TabsTrigger>
            </TabsList>

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
                        {country.population.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Languages</p>
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
                      <p className="text-sm text-muted-foreground">Region</p>
                      <p className="font-medium">
                        {country.region} ({country.subregion})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capital</p>
                      <p className="font-medium">
                        {country.capital?.[0] || "N/A"}
                      </p>
                    </div>
                    {country?.borders && country?.borders?.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Bordering Countries
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {country?.borders?.map((border) => (
                            <Link href={`/country/${border}`} key={border}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                              >
                                {border}
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Time & Currency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {country.timezones && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Timezones
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {country.timezones.map((timezone) => (
                            <span
                              key={timezone}
                              className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                            >
                              {timezone}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Currencies
                      </p>
                      <div className="space-y-1 mt-1">
                        {Object.values(country.currencies || {}).map(
                          (currency: { name: string; symbol: string }) => (
                            <p key={currency.name} className="font-medium">
                              {currency.name} ({currency.symbol})
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Maps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <a
                      href={`https://www.google.com/maps/place/${encodeURIComponent(
                        country?.name?.common
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      View on Google Maps
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/relation/${
                        country?.osmId || ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      View on OpenStreetMap
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="geography" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {country.area.toLocaleString()} km²
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Coordinates
                      </p>
                      <p className="font-medium">
                        {country?.latlng?.[0].toFixed(2)}°N,{" "}
                        {country?.latlng?.[1].toFixed(2)}°E
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Waves className="h-5 w-5" />
                      Coastline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {country?.landlocked ? (
                      <p>This country is landlocked</p>
                    ) : (
                      <p>This country has access to the sea</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Cities</CardTitle>
                </CardHeader>
                <CardContent>
                  <CitySearch countryCode={country.cca2} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Driving Side</p>
                <p className="font-medium capitalize">
                  {country?.car?.side || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country Code</p>
                <p className="font-medium">
                  {country.cca2} / {country.cca3}
                </p>
              </div>
              {country?.tld && (
                <div>
                  <p className="text-sm text-muted-foreground">Internet TLD</p>
                  <div className="flex flex-wrap gap-2">
                    {country?.tld?.map((domain) => (
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
