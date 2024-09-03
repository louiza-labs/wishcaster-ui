"use client"

import { Suspense, useCallback, useMemo, useState } from "react"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { ChevronDown } from "lucide-react"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Category {
  category: {
    label: string
    id: string
  }
  request: string
}

interface CategoriesFeedProps {
  categories: Category[]
  asFilterBar?: boolean
}

const filterDuplicateCategories = (categories: Category[]) => {
  if (
    !categories ||
    (Array.isArray(categories) && !categories.length) ||
    !Array.isArray(categories)
  ) {
    return []
  }
  const categoriesIndex = categories.reduce(
    (categoriesObj: any, category: any) => {
      if (
        !categoriesObj[category.category.id] &&
        category.category.id &&
        category.category.id.length
      ) {
        categoriesObj[category.category.id] = category.category
      }
      return categoriesObj
    },
    {}
  )

  return Object.values(categoriesIndex)
}

const CategoriesFeed = ({ categories, asFilterBar }: CategoriesFeedProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const path = usePathname()
  const params = useParams()
  const isOnTopicOrTopicsPage = path.includes("topic")
  const topicFromTopicPage = isOnTopicOrTopicsPage
    ? params.topic
      ? Array.isArray(params.topic)
        ? params.topic.join(",")
        : params.topic
      : ""
    : ""

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const categoriesFromParams = useMemo(
    () => searchParams.getAll("topics"),
    [searchParams]
  )

  const filteredCategories = useMemo(
    () => filterDuplicateCategories(categories),
    [categories]
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

  const handleToggleCategoryClick = useCallback(
    (categoryName: string) => {
      const isToggled = categoriesFromParams.includes(categoryName)
      const newSearchParams = createQueryString(
        "topics",
        categoryName,
        !isToggled
      )
      router.push("?" + newSearchParams)
      setSelectedCategories((prev) =>
        isToggled
          ? prev.filter((category) => category !== categoryName)
          : [...prev, categoryName]
      )
    },
    [categoriesFromParams, createQueryString, router]
  )

  const categoryLabelFromPage = useMemo(() => {
    if (PRODUCT_CATEGORIES_AS_MAP[topicFromTopicPage]) {
      return PRODUCT_CATEGORIES_AS_MAP[topicFromTopicPage].label
    }
    return topicFromTopicPage
  }, [topicFromTopicPage])

  return (
    <Suspense>
      <div className="flex h-fit flex-col gap-y-6 lg:col-span-3">
        {asFilterBar ? null : (
          <p className="gap-x-2 text-lg font-bold leading-tight tracking-tighter md:text-lg">
            Topics
          </p>
        )}
        {asFilterBar && filteredCategories && filteredCategories.length ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[120px] justify-between rounded-full"
              >
                {selectedCategories.length > 0
                  ? selectedCategories.join(", ")
                  : "Topics"}
                <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]">
              {filteredCategories.map((category: any) => (
                <DropdownMenuItem
                  key={category.id}
                  onSelect={() => handleToggleCategoryClick(category.id)}
                >
                  <div className="flex items-center">
                    <Checkbox
                      checked={categoriesFromParams.includes(category.id)}
                      className="mr-2"
                    />
                    {category.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="grid size-fit grid-cols-2 gap-y-1 md:flex md:size-full md:flex-wrap md:gap-2 lg:col-span-3">
            {filteredCategories && filteredCategories.length > 0
              ? filteredCategories.map((category: any) => {
                  if (category.id) {
                    return (
                      <div
                        className="md:cols-span-3 col-span-1"
                        key={category.id}
                      >
                        <Badge
                          onClick={() => handleToggleCategoryClick(category.id)}
                          variant={
                            categoriesFromParams.includes(category.id)
                              ? "default"
                              : "outline"
                          }
                          className="h-10 w-fit cursor-pointer whitespace-nowrap"
                        >
                          {category.label}
                        </Badge>
                      </div>
                    )
                  }
                })
              : null}
          </div>
        )}
      </div>
    </Suspense>
  )
}

export default CategoriesFeed
