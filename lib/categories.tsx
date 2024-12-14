import { Home, Briefcase, Utensils, Bus, Stethoscope, GraduationCap, Umbrella, ShoppingCart } from 'lucide-react'
import { Category } from '@/types/category'

export const categories: Category[] = [
  {
    name: 'Cost of Living',
    slug: 'cost-of-living',
    icon: <Home className="w-6 h-6" />,
    description: 'Compare prices of rent, groceries, restaurants, and more.'
  },
  {
    name: 'Job Market',
    slug: 'job-market',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Explore salary information and job opportunities.'
  },
  {
    name: 'Food Scene',
    slug: 'food-scene',
    icon: <Utensils className="w-6 h-6" />,
    description: 'Discover local cuisines and restaurant ratings.'
  },
  {
    name: 'Transportation',
    slug: 'transportation',
    icon: <Bus className="w-6 h-6" />,
    description: 'Learn about public transit, traffic, and commute times.'
  },
  {
    name: 'Healthcare',
    slug: 'healthcare',
    icon: <Stethoscope className="w-6 h-6" />,
    description: 'Compare healthcare quality and accessibility.'
  },
  {
    name: 'Education',
    slug: 'education',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'Explore schools, universities, and education systems.'
  },
  {
    name: 'Climate',
    slug: 'climate',
    icon: <Umbrella className="w-6 h-6" />,
    description: 'Check average temperatures, rainfall, and air quality.'
  },
  {
    name: 'Shopping',
    slug: 'shopping',
    icon: <ShoppingCart className="w-6 h-6" />,
    description: 'Find information on local markets, malls, and prices.'
  },
]

