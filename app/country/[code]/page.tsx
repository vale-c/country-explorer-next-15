import { notFound } from "next/navigation";
import { getCountryByCode } from "@/lib/api";
import { CountryDetails } from "@/components/country-details";

interface CountryPageProps {
  params: Promise<{ code: string }>;
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { code } = await params;

  const country = await getCountryByCode(code);

  if (!country) {
    notFound();
  }

  return <CountryDetails country={country} />;
}
