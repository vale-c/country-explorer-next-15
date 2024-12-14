import { getCountries } from '@/lib/api'
import { CountryList } from '@/components/country-list'
import { HeroSection } from '@/components/hero-section'

export default async function Home() {
  const countries = await getCountries()

  return (
    <div className="space-y-12">
      <HeroSection />
      {countries.length > 0 ? (
        <CountryList countries={countries} />
      ) : (
        <p className="text-center text-red-500">Failed to load countries. Please try again later.</p>
      )}
    </div>
  )
}
