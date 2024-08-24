import { FC } from "react"
import { Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  categorizeArrayOfCasts,
  generateWhimsicalErrorMessages,
  searchCastsForCategories,
  sortCastsByProperty,
} from "@/lib/helpers"
import { Breadcrumbs } from "@/components/breadcrumbs"
import FilterBar from "@/components/filters/FilterBar"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import RedirectButton from "@/components/redirect/Button"
import Topics from "@/components/topics"
import {
  fetchPosts,
  getUsersNotionAccessCode,
  searchNotion,
} from "@/app/actions"

interface IndexPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
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

function filterForOnlyCastsOrTweets(filter: "cast" | "tweet", posts: any[]) {
  if (!(posts && Array.isArray(posts))) return []
  if (filter === "cast") {
    return posts.filter((post) => post.object === "cast")
  } else {
    return posts.filter((post) => !(post.object === "cast"))
  }
}

const TopicPage: FC<IndexPageProps> = async ({ searchParams }) => {
  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const sortParam = parseQueryParam(searchParams.sort)
  const mobileViewParam = parseQueryParam(searchParams.view)

  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = await searchNotion(notionAccessCode)
  const notionResults = notionSearch.results

  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined

  let castsAndTweets = await fetchPosts({
    timePeriod: timeFilterParam ?? "ytd",
    channelId: "someone-build",
  })

  const categories = categorizeArrayOfCasts(castsAndTweets) as Category[]

  if (categoryParam.length) {
    castsAndTweets = searchCastsForCategories(castsAndTweets, categoryParam)
  }
  if (sortParam) {
    castsAndTweets = sortCastsByProperty(castsAndTweets, sortParam)
  }

  const isError = !castsAndTweets.length
  const breadCrumbPages = [{ name: "Topics", link: "/topics" }]
  const onlyCasts = filterForOnlyCastsOrTweets("cast", castsAndTweets)
  const onlyTweets = filterForOnlyCastsOrTweets("tweet", castsAndTweets)

  return (
    <>
      <div className="top-66 sticky z-10">
        <FilterBar initialCasts={onlyCasts} posts={castsAndTweets} />
      </div>

      <section className="relative mx-auto p-6 md:container sm:px-6 lg:px-20">
        <Breadcrumbs pages={breadCrumbPages} />

        <main className="relative grid grid-cols-1 gap-4 py-10 lg:grid-cols-12 ">
          <article className="no-scrollbar lg:col-span-12 lg:px-2  ">
            <Topics
              casts={castsAndTweets}
              mobileView={mobileViewParam}
              notionResults={notionResults}
            />
          </article>
        </main>
      </section>
      <div className="flex flex-col items-start lg:hidden">
        <BottomMobileNav
          filteredPosts={castsAndTweets}
          initialCasts={onlyCasts}
          page={"topics"}
        />
      </div>
    </>
  )
}

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="flex flex-col items-center gap-2 md:items-start">
      <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
        Trending Product Topics
      </h1>
      {/* <p className="text-center text-xs sm:text-lg md:text-left lg:max-w-[700px]">
        Sourced from Farcaster&apos;s{" "}
        <span className="font-bold">someone-build channel</span>
      </p> */}
    </div>
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
