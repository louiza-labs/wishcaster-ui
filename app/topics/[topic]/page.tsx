import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP, dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
  categorizeArrayOfCasts,
  filterCastsForCategory,
  generateWhimsicalErrorMessages,
  sortCastsByProperty,
  summarizeByCategory,
} from "@/lib/helpers"
import Cast from "@/components/cast"
import CastFeed from "@/components/feed/casts"
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

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

function extractTimeFilterParam(params: undefined | string | string[]) {
  if (params) {
    if (params && Array.isArray(params)) {
      return params.find((param: string) => dateOptions.includes(param))
    } else if (params && typeof params === "string") {
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
  ) as Array<CastType>

  filteredCasts = filterCastsForCategory(filteredCasts, params.topic)
  const topicStats = summarizeByCategory(filteredCasts, "likes")[0]
  const sortedCasts = sortCastsByProperty(filteredCasts, "liked_count")
  const topCast = sortedCasts[0]

  const isError = !filteredCasts.length || !selectedTopic

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
          <section className="mx-auto h-fit py-6 md:container sm:px-6 lg:h-auto lg:px-20">
            <div className="mb-4 flex flex-row items-center justify-between gap-x-4">
              {/* Placeholder for Header if needed */}
              <h1 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                {selectedTopic.label}
              </h1>
              <TopicStats statsObject={topicStats} />
            </div>
            <main className="relative mt-10 grid min-h-screen grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-x-10">
              <article
                className={`${
                  mobileViewParam.length && mobileViewParam !== "cast"
                    ? "hidden lg:flex"
                    : ""
                }  overflow-y-auto lg:col-span-8`}
              >
                <div className="gap-y-4 overflow-y-auto pb-14 lg:pb-0">
                  {topCast ? (
                    <>
                      <div className="bg-background flex flex-col flex-wrap gap-y-4">
                        <h2 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                          Top Casts
                        </h2>
                        <div className="flex size-fit flex-row items-start">
                          <Cast
                            {...topCast}
                            hideMetrics={true}
                            badgeIsToggled={false}
                            routeToWarpcast={true}
                            mentionedProfiles={topCast.mentioned_profiles}
                          />
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </article>

              <div
                className={`${
                  mobileViewParam !== "build" ? "hidden lg:block" : ""
                } overflow-y-auto sm:col-span-4`}
              >
                <div className="flex flex-col gap-y-8">
                  <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
                    Let&apos;s build
                  </h1>
                  {/* <Build
                cast={castWithCategory}
                hash={castWithCategory ? castWithCategory.hash ?? "" : ""}
                reactions={reactionsObject}
              /> */}
                </div>
              </div>
              <div className="col-span-12 flex flex-col items-center">
                <h3 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                  Casts Feed
                </h3>
                <CastFeed
                  casts={filteredCasts}
                  timeFilterParam={timeFilterParam}
                  nextCursor={cursorToUse}
                />
              </div>
            </main>
          </section>
          <div className="flex flex-col items-start lg:hidden">
            <BottomMobileNav
              filteredCasts={[topCast]}
              initialCasts={[topCast]}
              page="cast"
            />
          </div>
        </>
      )}
    </>
  )
}

interface HeaderProps {}

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
    <>
      <div className="col-span-12 flex flex-col items-center gap-y-4 px-4">
        <h6 className="mt-20 text-center text-xl font-extrabold leading-tight tracking-tighter sm:text-3xl">
          {generateWhimsicalErrorMessages()}
        </h6>
        <p className="gap-x-2 text-center text-xl font-light leading-tight tracking-tighter md:text-xl">
          This error is showing because no casts are available, try clearing
          some filters
        </p>
        {(searchTerm.length || filtersParam.length || categoryParam.length) && (
          <RedirectButton path={"/"} buttonText="Clear Filters" />
        )}
      </div>
    </>
  )
}

export default TopicPage
