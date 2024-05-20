"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"

interface Category {
  category: string
  request: string
}

interface CategoriesFeedProps {
  categories: Category[]
}

const CategoriesFeed = ({ categories }: CategoriesFeedProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const categoriesFromParams = useMemo(
    () => searchParams.getAll("categories"),
    [searchParams]
  )

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      const existingCategories = params.getAll(name)

      if (addValue) {
        if (!existingCategories.includes(value)) {
          params.append(name, value)
        }
      } else {
        const updatedCategories = existingCategories.filter(
          (category) => category !== value
        )
        params.delete(name)
        updatedCategories.forEach((category) => {
          params.append(name, category)
        })
      }

      return params.toString()
    },
    [searchParams]
  )

  const badgeIsToggled = useCallback(
    (categoryName: string) => {
      return categoriesFromParams.includes(categoryName)
    },
    [categoriesFromParams]
  )

  const handleToggleCategoryClick = useCallback(
    (categoryName: string) => {
      const isToggled = categoriesFromParams.includes(categoryName)
      const newSearchParams = createQueryString(
        "categories",
        categoryName,
        !isToggled
      )
      router.push("?" + newSearchParams)
    },
    [categoriesFromParams, createQueryString, router]
  )
  console.log("the categories", categories)

  return (
    <Suspense>
      <div className="flex h-fit flex-col gap-y-6 lg:col-span-3">
        <p className="gap-x-2 text-lg font-bold leading-tight tracking-tighter md:text-lg">
          Topics
        </p>
        <div className=" grid size-fit grid-cols-2 md:flex md:size-full md:flex-wrap md:gap-2 lg:col-span-3">
          {categories && categories.length > 0
            ? categories.map((category) => {
                if (category.category) {
                  return (
                    <div
                      className="md:cols-span-3 col-span-1"
                      key={category.request}
                    >
                      <Badge
                        onClick={() =>
                          handleToggleCategoryClick(category.category)
                        }
                        variant={
                          badgeIsToggled(category.category)
                            ? "default"
                            : "outline"
                        }
                        className="h-10 w-fit cursor-pointer whitespace-nowrap"
                      >
                        {category.category}
                      </Badge>
                    </div>
                  )
                }
              })
            : null}
        </div>
      </div>
    </Suspense>
  )
}

export default CategoriesFeed
