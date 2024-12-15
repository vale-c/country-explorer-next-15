// components/city-details.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CityData } from "@/types/city";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@/components/ui/button";

const markerIcon = new L.Icon({
  iconUrl: "/leaflet/images/marker-icon.png",
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface CityDetailsProps {
  cityDetails: CityData;
}

export function CityDetails({ cityDetails }: CityDetailsProps) {
  const lat = parseFloat(cityDetails.lat);
  const lon = parseFloat(cityDetails.lon);

  return (
    <div className="space-y-8 mt-8">
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
      <Card>
        <CardHeader>
          <CardTitle>Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={[lat, lon]}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[lat, lon]} icon={markerIcon}>
                <Popup>
                  <div className="text-center">
                    <h2 className="font-bold">
                      {cityDetails.address.city || cityDetails.address.town}
                    </h2>
                    <p>{cityDetails.address.country}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
