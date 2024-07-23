"use client"

import { Suspense, useCallback, useMemo } from "react"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const categoriesFromParams = useMemo(
    () => searchParams.getAll("topics"),
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
      if (isOnTopicOrTopicsPage) {
        router.push(`/topics/${categoryName}`)
      } else {
        const isToggled = categoriesFromParams.includes(categoryName)
        const newSearchParams = createQueryString(
          "topics",
          categoryName,
          !isToggled
        )
        router.push("?" + newSearchParams)
      }
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
        {asFilterBar && categories && categories.length ? (
          <Select
            defaultValue={topicFromTopicPage ? topicFromTopicPage : "Select"}
            onValueChange={(value) => handleToggleCategoryClick(value)}
          >
            <SelectTrigger className="size-fit gap-x-2 whitespace-nowrap rounded-full px-2 text-sm font-semibold focus:ring-0 focus:ring-transparent focus:ring-offset-0">
              <SelectValue
                placeholder="Select a Topic"
                defaultValue={
                  topicFromTopicPage ? topicFromTopicPage : "Select"
                }
              />
              {categoryLabelFromPage ? categoryLabelFromPage : "Topic"}
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => {
                if (category.category) {
                  return (
                    <SelectItem
                      value={category.category.id}
                      key={category.request}
                    >
                      {category.category.label}
                    </SelectItem>
                  )
                }
              })}
            </SelectContent>
          </Select>
        ) : (
          <div className=" grid size-fit grid-cols-2 gap-y-1 md:flex md:size-full md:flex-wrap md:gap-2 lg:col-span-3">
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
                            handleToggleCategoryClick(category.category.id)
                          }
                          variant={
                            badgeIsToggled(category.category.id)
                              ? "default"
                              : "outline"
                          }
                          className="h-10 w-fit cursor-pointer whitespace-nowrap"
                        >
                          {category.category.label}
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
