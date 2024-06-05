import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP, dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
  categorizeArrayOfCasts,
  filterCastsForCategory,
  generateWhimsicalErrorMessages,
  sortCastsByProperty,
} from "@/lib/helpers"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"
import BuildComponent from "@/components/buildComponent/Topic"
import CastFeed from "@/components/feed/casts"
import TopCasts from "@/components/feed/casts/TopCasts"
import FilterBar from "@/components/filters/FilterBar"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import RedirectButton from "@/components/redirect/Button"
import TopicStats from "@/components/topics/stats"
import { fetchCastsUntilCovered, fetchChannelCasts } from "@/app/actions"

interface CastPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
  params: {
    topic: string
  }
}

const parseQueryParam = (param?: string | string[]): string =>
  Array.isArray(param) ? param.join(",") : param || ""

const extractTimeFilterParam = (params?: string | string[]) => {
  if (params) {
    if (Array.isArray(params)) {
      return params.find((param: string) => dateOptions.includes(param))
    } else if (typeof params === "string") {
      return dateOptions.find((option) => option === params)
    }
  }
}

const TopicPage: FC<CastPageProps> = async ({ searchParams, params }) => {
  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const sortParam = parseQueryParam(searchParams.sort)

  const selectedTopic = params.topic
    ? PRODUCT_CATEGORIES_AS_MAP[params.topic]
    : null

  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined

  const { casts: initialCasts, nextCursor: cursorToUse } = !timeFilterParam
    ? await fetchChannelCasts("someone-build")
    : await fetchCastsUntilCovered(
        "someone-build",
        timeFilterParam as "24-hours" | "7-days" | "30-days" | "ytd"
      )

  let filteredCasts = initialCasts
  const categories = categorizeArrayOfCasts(filteredCasts) as Category[]
  const mobileViewParam = parseQueryParam(searchParams.view)

  filteredCasts = addCategoryFieldsToCasts(
    filteredCasts,
    categories
  ) as CastType[]
  filteredCasts = filterCastsForCategory(filteredCasts, params.topic)
  const sortedCasts = sortCastsByProperty(filteredCasts, "liked_count")
  const topCast = sortedCasts[0]

  const isError = !filteredCasts.length || !selectedTopic
  const breadCrumbPages = [
    { name: "Topics", link: "/topics" },
    {
      name: selectedTopic ? selectedTopic.label : params.topic,
      link: `/topics/${params.topic}`,
    },
  ]

  return (
    <>
      {isError ? (
        <ErrorDisplay
          searchTerm={searchTerm}
          filtersParam={filtersParam}
          categoryParam={categoryParam}
        />
      ) : (
        <>
          <div className="top-66 sticky z-10">
            <FilterBar initialCasts={initialCasts} />
          </div>
          <section className="mx-auto h-fit py-6 md:container sm:px-6 lg:h-auto lg:px-20">
            <div className="px-6 md:px-0">
              <Breadcrumbs pages={breadCrumbPages} />
            </div>

            <div className="my-4 flex flex-col items-center justify-between gap-x-4 md:mt-0 md:flex-row">
              <div className="mb-4 flex w-full flex-row gap-x-2 px-6 md:mb-0 md:flex-col md:gap-x-0 md:gap-y-2 md:px-0">
                <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                  {selectedTopic?.label}
                </h1>
                <div className="hidden flex-row items-center gap-x-2 md:flex">
                  <p className="text-sm font-semibold md:block">
                    Based on casts that mention:
                  </p>
                  <div className="flex flex-wrap gap-x-1">
                    {Array.from(selectedTopic?.keywords || []).map(
                      (keyword) => (
                        <Badge
                          variant={"outline"}
                          key={keyword}
                          className="text-sm font-light"
                        >
                          {keyword}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>

              <TopicStats
                casts={sortedCasts}
                cursor={cursorToUse}
                topic={params.topic}
                mobileView={mobileViewParam}
              />
            </div>
            <main className="relative grid min-h-screen grid-cols-1 gap-4 lg:mt-10 lg:grid-cols-12 lg:gap-x-10">
              <article
                className={`${
                  mobileViewParam.length && mobileViewParam !== "popular"
                    ? "hidden lg:flex"
                    : "flex"
                } overflow-y-auto lg:col-span-8`}
              >
                <div className="gap-y-4 overflow-y-auto pb-0 lg:pb-0">
                  {topCast && (
                    <div className="bg-background flex flex-col flex-wrap gap-y-4 overflow-auto">
                      <h2 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                        Top Casts
                      </h2>
                      <div className="flex size-fit flex-row items-start lg:h-[70vh] xl:h-fit">
                        <TopCasts
                          casts={initialCasts}
                          cursor={cursorToUse}
                          topic={params.topic}
                          sortParam={sortParam}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </article>

              <div
                className={`${
                  mobileViewParam !== "build" ? "hidden lg:block" : "block"
                } col-span-12  overflow-y-auto sm:col-span-4`}
              >
                <div className="flex flex-col gap-y-8">
                  <h1 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl lg:block">
                    Let&apos;s build
                  </h1>
                  <BuildComponent
                    casts={initialCasts}
                    cursor={cursorToUse}
                    topic={params.topic}
                  />
                </div>
              </div>
              <div
                className={`${
                  mobileViewParam !== "feed" ? "hidden lg:flex" : "flex"
                } h-fit flex-col items-center gap-y-4 lg:col-span-12`}
              >
                <h3 className="text-center text-2xl  font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                  Casts Feed
                </h3>
                <CastFeed
                  casts={[]}
                  timeFilterParam={timeFilterParam}
                  nextCursor={cursorToUse}
                  columns={3}
                  topic={params.topic}
                />
              </div>
            </main>
          </section>
          <div className="flex flex-col items-start lg:hidden">
            <BottomMobileNav
              filteredCasts={sortedCasts}
              initialCasts={sortedCasts}
              page="topic"
            />
          </div>
        </>
      )}
    </>
  )
}

interface ErrorDisplayProps {
  searchTerm: string
  filtersParam: string
  categoryParam: string
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({
  searchTerm,
  filtersParam,
  categoryParam,
}) => {
  return (
    <div className="col-span-12 flex flex-col items-center gap-y-4 px-4">
      <h6 className="mt-20 text-center text-xl font-extrabold leading-tight tracking-tighter sm:text-3xl">
        {generateWhimsicalErrorMessages()}
      </h6>
      <p className="gap-x-2 text-center text-xl font-light leading-tight tracking-tighter md:text-xl">
        This error is showing because no casts are available, try clearing some
        filters
      </p>
      {(searchTerm.length || filtersParam.length || categoryParam.length) && (
        <RedirectButton path={"/"} buttonText="Clear Filters" />
      )}
    </div>
  )
}

export default TopicPage
