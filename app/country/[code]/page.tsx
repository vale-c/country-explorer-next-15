import { notFound } from 'next/navigation';
import { getCountryByCode } from '@/app/country/_actions/get-country-by-code.action';
import { getCountryData } from '@/app/country/_actions/get-country-data.action';
import { getCountryImage } from '@/app/country/_actions/get-country-image.action';
import { CountryDetails } from '@/app/country/country-details';

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
