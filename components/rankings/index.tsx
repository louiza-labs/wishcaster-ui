"use client"

import { Suspense, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NormalizedPostType } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import { buildRankings } from "@/lib/helpers"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RankedValueType = {
  name: string
  value: number
}

interface CardStatProp {
  title: string
  value: string | number
  rank: number
  topic: string
  handleClick: any
  isToggled: boolean
}

const CardStat: React.FC<CardStatProp> = ({
  title,
  value,
  rank,
  topic,
  handleClick,
  isToggled,
}) => {
  return (
    <Card
      onClick={handleClick}
      className={`flex w-40 cursor-pointer snap-start flex-col items-center transition duration-150 ease-in-out md:w-fit md:min-w-24 ${
        isToggled
          ? "brightness-120 border-2 border-indigo-500 dark:border-indigo-300"
          : ""
      } hover:scale-105 active:scale-95`}
    >
      <span className="mt-2 break-all px-2 text-xs">{topic}</span>
      <CardHeader className="flex w-full flex-col items-center justify-center p-2">
        <CardDescription className="text-xl font-bold text-black dark:text-white">
          {value}
        </CardDescription>
        <Badge
          variant={"secondary"}
          className="m-1 mb-0 flex flex-row items-center justify-center gap-x-1"
        >
          <span className="text-xs">Rank:</span>
          <span className="text-xs font-bold">{rank}</span>
        </Badge>
      </CardHeader>
    </Card>
  )
}

interface RankingsProps {
  view?: "search" | "feed"
  posts: NormalizedPostType[] // Assuming this can be a combination of normalized posts
}

const Rankings: React.FC<RankingsProps> = ({ view, posts }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

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
    (categoryName: string) => categoriesFromParams.includes(categoryName),
    [categoriesFromParams]
  )

  const handleToggleCategoryClick = useCallback(
    (categoryName: string) => {
      const isToggled = categoriesFromParams.includes(categoryName)
      const newSearchParams = createQueryString(
        "topics",
        categoryName,
        !isToggled
      )
      router.push(`?${newSearchParams}`)
    },
    [categoriesFromParams, createQueryString, router]
  )

  const rankedTopics = useMemo(
    () => ({
      likes: buildRankings(
        posts,
        "category",
        "likesCount",
        view === "search" ? 100 : 20
      ),
      replies: buildRankings(
        posts,
        "category",
        "commentsCount",
        view === "search" ? 100 : 20
      ),
      recasts: buildRankings(
        posts,
        "category",
        "sharesCount",
        view === "search" ? 100 : 20
      ),
    }),
    [posts, view]
  )

  const hasResults = useMemo(
    () =>
      Object.values(rankedTopics).some((topics) => topics && topics.length > 0),
    [rankedTopics]
  )

  const RankedCard = useCallback(
    ({ value, index }: any) => {
      const topicLabel =
        PRODUCT_CATEGORIES_AS_MAP[value.name]?.label || value.name
      return (
        <>
          <div className="flex xl:hidden">
            <div className="md:cols-span-3 col-span-1">
              <Badge
                onClick={() => handleToggleCategoryClick(value.name)}
                variant={badgeIsToggled(value.name) ? "default" : "outline"}
                className="h-10 w-fit cursor-pointer whitespace-nowrap"
              >
                {topicLabel}
              </Badge>
            </div>
          </div>
          <div className="hidden xl:flex">
            <CardStat
              title={`#${index}`}
              value={value.value}
              rank={index}
              topic={topicLabel}
              isToggled={badgeIsToggled(value.name)}
              handleClick={() => handleToggleCategoryClick(value.name)}
            />
          </div>
        </>
      )
    },
    [badgeIsToggled, handleToggleCategoryClick]
  )

  const RankedValues = useCallback(
    ({ values }: { values: RankedValueType[] }) => {
      return (
        <ol className="mt-4 flex w-full flex-wrap gap-2">
          {values && Array.isArray(values)
            ? values.map((value: RankedValueType, index: number) => (
                <RankedCard value={value} index={index + 1} key={index} />
              ))
            : null}
        </ol>
      )
    },
    [RankedCard]
  )

  if (!hasResults) {
    return (
      <div className="flex flex-col gap-y-2">
        <p className="text-center text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
          Unable to generate topics
        </p>
        <p className="text-center text-xl font-light leading-tight tracking-tighter md:text-xl">
          This error is showing because no casts or categories can be generated.
          Try clearing some filters or extending the timerange.
        </p>
      </div>
    )
  }

  return (
    <Suspense>
      <div className="flex h-fit flex-col gap-y-6 px-4">
        <h3
          className={`${
            view === "search" ? "md:hidden" : "md:block"
          } hidden gap-x-2 text-2xl font-bold leading-tight tracking-tighter md:text-2xl`}
        >
          Trending Requests Topics
        </h3>

        <Tabs
          orientation="vertical"
          defaultValue="likes"
          className="hidden w-full flex-col items-center gap-y-2 md:w-fit md:items-start xl:flex xl:items-center"
        >
          <TabsList className="flex size-auto items-start md:size-full md:flex-col md:justify-around lg:flex-col xl:flex-row">
            {Object.keys(rankedTopics).map((topic) => (
              <TabsTrigger
                key={topic}
                className="p-2 lg:w-fit lg:text-sm 2xl:text-base"
                value={topic}
              >
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(rankedTopics).map(([topic, values]) => (
            <TabsContent key={topic} value={topic}>
              <RankedValues values={values} />
            </TabsContent>
          ))}
        </Tabs>
        <div className="-mt-4 flex xl:hidden">
          <RankedValues values={rankedTopics.likes} />
        </div>
      </div>
    </Suspense>
  )
}

export default Rankings
