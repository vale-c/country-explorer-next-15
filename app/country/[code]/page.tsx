import { notFound } from "next/navigation";
import { getCountryByCode } from "@/lib/api";
import { getCountryData } from "@/app/api/country-data";
import { CountryDetails } from "@/components/country-details";

interface CountryPageProps {
  params: { code: string };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const country = await getCountryByCode(params.code);

  if (!country) {
    notFound();
  }

  const qualityOfLife = await getCountryData(country.cca3);

  return <CountryDetails country={country} qualityOfLife={qualityOfLife} />;
}
