import { CategoryList } from '@/components/category-list'
import { categories } from '@/lib/categories'

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Categories</h1>
      <p className="text-xl text-muted-foreground">
        Explore different aspects of city life and compare data across various categories.
      </p>
      <CategoryList categories={categories} />
    </div>
  )
}
