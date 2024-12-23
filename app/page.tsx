import Link from 'next/link';

import { InteractiveMap } from '@/components/interactive-map';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Globe, DollarSign, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

export default async function CountriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            Welcome to TechNomadHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover the perfect destinations for your tech career and lifestyle
          </p>
          <Button className="glow-hover text-lg py-6 px-8">
            <Link href="/cost-of-living" className="flex items-center">
              Explore Destinations <ArrowRightIcon className="ml-2" />
            </Link>
          </Button>
        </section>
        <div className="relative mb-4 md:mb-6 lg:mb-8 -mt-2 md:-mt-4">
          <InteractiveMap />
        </div>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10">
          <Card className="bg-card neon-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 text-primary" /> Top Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  'Bali, Indonesia',
                  'Lisbon, Portugal',
                  'Chiang Mai, Thailand',
                ].map((destination) => (
                  <li key={destination} className="flex items-center">
                    <Badge variant="secondary" className="mr-2">
                      New
                    </Badge>
                    {destination}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-primary">
                View all destinations
              </Button>
            </CardFooter>
          </Card>
          <Card className="bg-card neon-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 text-black dark:text-white" />{' '}
                Salary Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  'Software Engineer: $95,000',
                  'Product Manager: $110,000',
                  'Data Scientist: $105,000',
                ].map((salary) => (
                  <li
                    key={salary}
                    className="flex items-center justify-between"
                  >
                    <span>{salary.split(':')[0]}</span>
                    <Badge>{salary.split(':')[1]}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                className="text-secondary dark:text-gray-200 text-black"
              >
                Explore salary data
              </Button>
            </CardFooter>
          </Card>
          <Card className="bg-card neon-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 text-accent text-black dark:text-white" />{' '}
                Community Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {['Upcoming Meetups', 'Job Opportunities', 'Skill Sharing'].map(
                  (item) => (
                    <li key={item} className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        Hot
                      </Badge>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-black dark:text-white">
                Join the community
              </Button>
            </CardFooter>
          </Card>
        </section>
        <div className="fixed inset-0 pointer-events-none z-0">
          <ShootingStars />
          <StarsBackground />
        </div>
      </main>
    </div>
  );
}
