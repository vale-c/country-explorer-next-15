import { notFound } from 'next/navigation'
import { getCountryByCode } from '@/lib/api'
import { CountryDetails } from '@/components/country-details'

interface CountryPageProps {
  params: { code: string }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const country = await getCountryByCode(params.code)

  if (!country) {
    notFound()
  }

  return <CountryDetails country={country} />
}
