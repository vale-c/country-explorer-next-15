import { notFound } from 'next/navigation';
import { getCountryByCode, getCountryData, getCountryImage } from '@/lib/data';
import { CountryDetails } from '@/app/countries/_components/country-details';

interface CountryPageProps {
  params: Promise<{ code: string }>;
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { code } = await params;
  const country = await getCountryByCode(code);

  if (!country) {
    notFound();
  }

  const qualityOfLife = await getCountryData(country.cca3);
  const countryImage = await getCountryImage(country.name.common);

  if (!qualityOfLife) {
    notFound();
  }

  return (
    <CountryDetails
      country={country}
      qualityOfLife={qualityOfLife}
      countryImage={countryImage}
    />
  );
}
