"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(search)}`)
  }

  return (
    <section className="text-center space-y-6">
      <h1 className="text-4xl font-bold">Explore Cities and Quality of Life</h1>
      <p className="text-xl text-muted-foreground">
        Compare cost of living, crime rates, and more across cities worldwide
      </p>
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <Input
          type="text"
          placeholder="Search cities or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">Search</Button>
      </form>
    </section>
  )
}

