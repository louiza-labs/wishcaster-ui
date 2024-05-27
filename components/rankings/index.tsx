"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { buildRankings } from "@/lib/helpers"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RankedValueType = {
  name: string
  value: number
}

const Rankings = ({ casts }: any) => {
  const { filteredCasts } = useFilterFeed(casts)

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

  // const rankedTopicsByCount = buildRankings(
  //   filteredCasts,
  //   "category",
  //   "count",
  //   5
  // )
  const rankedTopicsByLikes = buildRankings(
    filteredCasts,
    "category",
    "likes_count",
    10
  )
  const rankedTopicsByReplies = buildRankings(
    filteredCasts,
    "category",
    "replies_count",
    10
  )
  const rankedTopicsByRecasts = buildRankings(
    filteredCasts,
    "category",
    "recasts_count",
    10
  )
  const hasResults = useMemo(() => {
    return (
      // (rankedTopicsByCount && rankedTopicsByCount.length) ||
      (rankedTopicsByLikes && rankedTopicsByLikes.length) ||
      (rankedTopicsByReplies && rankedTopicsByReplies.length) ||
      (rankedTopicsByRecasts && rankedTopicsByRecasts.length)
    )
  }, [
    // rankedTopicsByCount,
    rankedTopicsByLikes,
    rankedTopicsByRecasts,
    rankedTopicsByReplies,
  ])

  const RankedCard = ({ value, index }: any) => {
    return (
      <button
        onClick={() => handleToggleCategoryClick(value.name)}
        className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border dark:border-gray-200 dark:bg-transparent dark:text-gray-50 dark:hover:bg-gray-700"
      >
        <div className="flex w-full items-center justify-between gap-x-2">
          <span className="">{value.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {value.value}
          </span>
        </div>
      </button>
    )
  }

  const RankedValues = ({ values }: { values: RankedValueType[] }) => {
    return (
      <ol className="mt-4 flex w-full flex-wrap gap-4 ">
        {values && Array.isArray(values)
          ? values.map((value: RankedValueType, index: number) => (
              <RankedCard value={value} index={index + 1} key={index} />
            ))
          : null}
      </ol>
    )
  }

  const valueFormatter = (number: number) =>
    `$ ${Intl.NumberFormat("us").format(number).toString()}`

  return (
    <Suspense>
      {hasResults ? (
        <div className=" flex h-fit flex-col gap-y-6 lg:col-span-3">
          <h3 className="hidden gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:block md:text-3xl">
            Trending Topics
          </h3>
          <Tabs
            orientation="vertical"
            defaultValue="likes"
            className="flex w-full flex-col items-center gap-y-2 md:w-fit md:items-start"
          >
            <TabsList className="flex size-auto items-start md:h-full md:w-fit md:flex-col lg:flex-row">
              {/* <TabsTrigger value="count">Count</TabsTrigger> */}
              <TabsTrigger className="" value="likes">
                Likes
              </TabsTrigger>
              <TabsTrigger value="replies">Replies</TabsTrigger>
              <TabsTrigger value="recasts">Recasts</TabsTrigger>
            </TabsList>
            {/* <TabsContent value="count">
              <RankedValues values={rankedTopicsByCount} />
            </TabsContent> */}
            <TabsContent value="likes">
              <RankedValues values={rankedTopicsByLikes} />
            </TabsContent>
            <TabsContent value="replies">
              <RankedValues values={rankedTopicsByReplies} />
            </TabsContent>
            <TabsContent value="recasts">
              <RankedValues values={rankedTopicsByRecasts} />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col  gap-y-2">
          <p className="gap-x-2 text-center text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
            Unable to generate topics
          </p>
          <p className="gap-x-2 text-center text-xl font-light leading-tight tracking-tighter md:text-xl">
            This error is showing because no casts are available, try clearing
            some filters{" "}
          </p>
        </div>
      )}
    </Suspense>
  )
}

export default Rankings
