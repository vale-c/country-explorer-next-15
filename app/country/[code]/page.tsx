import { notFound } from 'next/navigation';
import { getCountryByCode } from '@/lib/api';
import { getCountryData } from '@/app/api/country-data';
import { CountryDetails } from '@/components/country-details';
import { getCountryImage } from '@/app/actions/getCountryImage';

interface CountryPageProps {
  params: Promise<{ code: string }>;
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { code } = await params;
  const country = await getCountryByCode(code);
  const qualityOfLife = await getCountryData(country.cca3);
  const countryImage = await getCountryImage(country.name.common);

  if (!country || !qualityOfLife) {
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
