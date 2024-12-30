"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CityData } from "@/types/city";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@/components/ui/button";

interface CityDetailsProps {
  cityDetails: CityData;
}

export function CityDetails({ cityDetails }: CityDetailsProps) {
  return (
    <div className="space-y-8">
      <Link
        href={`/country/${cityDetails.address.country_code}`}
        className={buttonVariants({ variant: "ghost" })}
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" />
        Back to {cityDetails.address.country}
      </Link>

      <h1 className="text-4xl font-bold text-center mb-6">
        {cityDetails.address.city || cityDetails.address.town}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Country:</strong> {cityDetails.address.country}
            </p>
            {cityDetails.address.state && (
              <p>
                <strong>State:</strong> {cityDetails.address.state}
              </p>
            )}
            {cityDetails.address.county && (
              <p>
                <strong>County:</strong> {cityDetails.address.county}
              </p>
            )}
            {cityDetails.address.postcode && (
              <p>
                <strong>Postcode:</strong> {cityDetails.address.postcode}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Coordinates</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Latitude:</strong> {cityDetails.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {cityDetails.lon}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
