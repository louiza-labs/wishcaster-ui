import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP, dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
  addUserInfoToTweets,
  categorizeArrayOfCasts,
  extractUserIdsFromTweets,
  filterCastsForCategory,
  generateWhimsicalErrorMessages,
  removeDuplicateTweets,
  sortCastsByProperty,
} from "@/lib/helpers"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"
import TopCasts from "@/components/feed/casts/TopCasts"
import CastsAndTweetsFeed from "@/components/feed/castsAndTweets"
import FilterBar from "@/components/filters/FilterBar"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import RankedUsers from "@/components/rankings/users"
import RedirectButton from "@/components/redirect/Button"
import TopicStats from "@/components/topics/stats"
import {
  fetchTweetsUntilCovered,
  fetchTwitterUsersUntilCovered,
  getUsersNotionAccessCode,
  searchNotion,
} from "@/app/actions"

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

  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = notionAccessCode
    ? await searchNotion(notionAccessCode)
    : { results: [] }
  const notionResults = notionSearch.results

  const selectedTopic = params.topic
    ? PRODUCT_CATEGORIES_AS_MAP[params.topic]
    : null

  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined

  const { tweets } = await fetchTweetsUntilCovered()
  let tweetsWithoutDuplicates = removeDuplicateTweets(tweets)

  const users = await fetchTwitterUsersUntilCovered(
    extractUserIdsFromTweets(tweetsWithoutDuplicates)
  )

  const tweetsWithUsers = addUserInfoToTweets(
    tweetsWithoutDuplicates,
    users?.tweets
  )

  let filteredPosts = tweetsWithUsers
  const categories = categorizeArrayOfCasts(tweetsWithUsers) as Category[]
  const mobileViewParam = parseQueryParam(searchParams.view)

  filteredPosts = addCategoryFieldsToCasts(
    filteredPosts,
    categories
  ) as CastType[]

  filteredPosts = filterCastsForCategory(filteredPosts, params.topic)
  let topCast = filteredPosts.length === 1 ? filteredPosts[0] : undefined
  const sortedCasts = sortCastsByProperty(filteredPosts, "likes_count")
  topCast = topCast ? topCast : sortedCasts[0]

  const isError = !filteredPosts.length || !selectedTopic
  const breadCrumbPages = [
    { name: "Topics", link: "/topics" },
    {
      name: selectedTopic ? selectedTopic.label : params.topic,
      link: `/topics/${params.topic}`,
    },
  ]

  return (
    <>
      <div className="top-66 sticky z-10">
        <FilterBar initialCasts={filteredPosts} />
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
                Based on relevant posts that mention:
              </p>
              <div className="flex flex-wrap gap-1">
                {Array.from(selectedTopic?.keywords || []).map((keyword) => (
                  <Badge
                    variant={"outline"}
                    key={keyword}
                    className="text-sm font-light"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <TopicStats
            tweets={filteredPosts}
            topic={params.topic}
            cursor=""
            mobileView={mobileViewParam}
          />
        </div>
        <main className="relative grid min-h-screen grid-cols-1 gap-4 lg:mt-10 lg:grid-cols-12 lg:gap-x-10">
          <article
            className={`${
              mobileViewParam.length && mobileViewParam !== "popular"
                ? "hidden lg:flex "
                : "flex flex-col"
            } gap-y-6 overflow-y-auto lg:col-span-12`}
          >
            <div className="flex flex-col flex-wrap gap-y-4 overflow-auto ">
              <h2 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                Top Users
              </h2>
              <div className="flex size-fit flex-row items-start xl:h-fit">
                <RankedUsers tweets={filteredPosts} />
              </div>
            </div>
            <div className="flex flex-col gap-y-4 overflow-y-auto pb-0 lg:flex-row lg:gap-x-6 lg:pb-2">
              {topCast ? (
                <div className="flex flex-col flex-wrap gap-y-4 overflow-auto bg-background">
                  <h2 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                    Top Posts
                  </h2>
                  <div className="flex size-fit flex-row items-start lg:h-[70vh] xl:h-fit">
                    <TopCasts
                      tweets={filteredPosts}
                      topic={params.topic}
                      cursor=""
                      notionResults={notionResults}
                      sortParam={sortParam}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </article>

          <div
            className={`${
              mobileViewParam !== "build" ? "hidden lg:block" : "block"
            } col-span-12  overflow-y-auto sm:col-span-4`}
          >
            {/* <div className="flex flex-col items-end gap-y-8">
              <h1 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl lg:block">
                Let&apos;s build
              </h1>
              <BuildComponent
                casts={initialCasts}
                cursor={cursorToUse}
                topic={params.topic}
              />
            </div> */}
          </div>
          <div
            className={`${
              mobileViewParam !== "feed" ? "hidden lg:flex" : "flex"
            } h-fit flex-col items-center gap-y-4 lg:col-span-12`}
          >
            <h3 className="text-center text-2xl  font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
              Feed
            </h3>
            <CastsAndTweetsFeed
              casts={[]}
              timeFilterParam={timeFilterParam}
              nextCursor={""}
              columns={3}
              topic={params.topic}
              tweets={tweetsWithUsers}
            />
          </div>
        </main>
      </section>
      <div className="flex flex-col items-start lg:hidden">
        <BottomMobileNav
          filteredPosts={sortedCasts}
          initialCasts={sortedCasts}
          page="topic"
        />
      </div>
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
