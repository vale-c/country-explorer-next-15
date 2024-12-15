"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Globe,
  Clock,
  Users,
  ArrowRight,
  ExternalLink,
  Mountain,
  Sun,
  DollarSign,
  Shield,
  Stethoscope,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Country, QualityOfLife } from "@/types/country";
import { CitySearch } from "@/components/city-search";
import { InteractiveMap } from "@/components/interactive-map";

interface CountryDetailsProps {
  country: Country;
  qualityOfLife: QualityOfLife;
}

export function CountryDetails({
  country,
  qualityOfLife,
}: CountryDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <article className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[400px] rounded-xl overflow-hidden"
      >
        <Image
          src={country.flags?.svg ?? "/default-flag.svg"}
          alt={`${country.name?.common ?? "Unknown"} flag`}
          fill
          className="object-cover"
          priority
        />
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
                        {country.borders && country.borders.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Bordering Countries
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {country.borders.map((border) => (
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
                  </div>
                </TabsContent>

                <TabsContent value="economy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
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
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Unemployment Rate
                        </p>
                        <p className="text-2xl font-bold">
                          {qualityOfLife.unemploymentRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Life Expectancy
                        </p>
                        <p className="text-2xl font-bold">
                          {qualityOfLife.lifeExpectancy} years
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

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
          <Card>
            <CardHeader>
              <CardTitle>Quality of Life Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Cost of Living
                </span>
                <span className="font-medium">
                  {qualityOfLife.costOfLiving}/100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Safety
                </span>
                <span className="font-medium">{qualityOfLife.safety}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-red-500" />
                  Healthcare
                </span>
                <span className="font-medium">
                  {qualityOfLife.healthcare}/100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-yellow-500" />
                  Education
                </span>
                <span className="font-medium">
                  {qualityOfLife.education}/100
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </article>
  );
}
