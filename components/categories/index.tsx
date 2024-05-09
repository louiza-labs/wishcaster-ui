"use client"

import useGetCategories from "@/hooks/ai/useGetCategories"
import { Badge } from "@/components/ui/badge"

const CategoriesFeed = ({ casts }: any) => {
  const { categories } = useGetCategories(casts)

  return (
    <div className="cols-span-12 grid grid-cols-12">
      {categories
        ? categories.map((category) => (
            <div className="cols-span-3">
              {category ? <Badge>{category.description}</Badge> : null}
            </div>
          ))
        : null}
    </div>
  )
}

export default CategoriesFeed
