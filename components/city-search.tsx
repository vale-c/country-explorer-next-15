"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchCities } from "@/lib/api"

interface CitySearchProps {
  countryCode: string
}

export function CitySearch({ countryCode }: CitySearchProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const cities = await searchCities(`${query}, ${countryCode}`)
    if (cities.length > 0) {
      router.push(`/city/${cities[0].lat}/${cities[0].lon}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">Search City</Button>
    </form>
  )
}
