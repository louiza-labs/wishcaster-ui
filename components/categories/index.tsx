"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"

const CategoriesFeed = ({ categories }: any) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoriesFromParams = searchParams.getAll("categories")

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      // Get existing category values
      const existingCategories = params.getAll(name)

      if (addValue) {
        // Add the new value if it's not already present
        if (!existingCategories.includes(value)) {
          params.append(name, value)
        }
      } else {
        // Remove the value if it exists
        const updatedCategories = existingCategories.filter(
          (category) => category !== value
        )

        // Update the parameter with the filtered categories
        params.delete(name)
        updatedCategories.forEach((category) => {
          params.append(name, category)
        })
      }

      return params.toString()
    },
    [searchParams]
  )

  const badgeIsToggled = (categoryName: string) => {
    return categoriesFromParams && categoriesFromParams.includes(categoryName)
  }

  const handleToggleCategoryClick = (categoryName: string) => {
    if (categoriesFromParams && categoriesFromParams.length > 0) {
      // Check if the category is already toggled
      const isToggled = categoriesFromParams.includes(categoryName)

      // Toggle the category based on its current state
      const newSearchParams = createQueryString(
        "categories",
        categoryName,
        !isToggled
      )
      router.push("?" + newSearchParams)
    } else {
      // If no categories are selected, simply toggle the clicked category
      router.push("?" + createQueryString("categories", categoryName, true))
    }
  }

  return (
    <div className="cols-span-12 flex flex-wrap gap-2">
      {categories && Array.isArray(categories)
        ? categories.map((category) => (
            <div className="cols-span-3" key={category.request}>
              {category ? (
                <Badge
                  onClick={() => {
                    handleToggleCategoryClick(category.category)
                  }}
                  variant={
                    badgeIsToggled(category.category) ? "default" : "outline"
                  }
                  className="h-10 w-fit cursor-pointer whitespace-nowrap"
                >
                  {category.category}
                </Badge>
              ) : null}
            </div>
          ))
        : null}
    </div>
  )
}

export default CategoriesFeed
