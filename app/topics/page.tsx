import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
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
  fetchTweetsUntilCovered,
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

  const tweets = await fetchTweetsUntilCovered()
  let filteredPosts: any = [...(tweets?.tweets ? tweets.tweets : [])]
  const categories = categorizeArrayOfCasts(filteredPosts) as Category[]

  filteredPosts = addCategoryFieldsToCasts(
    filteredPosts,
    categories
  ) as Array<CastType>
  if (categoryParam.length) {
    filteredPosts = searchCastsForCategories(filteredPosts, categoryParam)
  }
  if (sortParam) {
    filteredPosts = sortCastsByProperty(filteredPosts, sortParam)
  }

  const isError = !filteredPosts.length
  const breadCrumbPages = [{ name: "Topics", link: "/topics" }]

  return (
    <>
      <div className="top-66 sticky z-10">
        <FilterBar initialCasts={filteredPosts} />
      </div>

      <section className="relative mx-auto p-6 md:container sm:px-6 lg:px-20">
        <Breadcrumbs pages={breadCrumbPages} />

        <main className="relative grid grid-cols-1 gap-4 py-10 lg:grid-cols-12 ">
          <article className="no-scrollbar lg:col-span-12 lg:px-2  ">
            <Topics
              posts={filteredPosts}
              mobileView={mobileViewParam}
              notionResults={notionResults}
            />
          </article>
        </main>
      </section>
      <div className="flex flex-col items-start lg:hidden">
        <BottomMobileNav
          filteredPosts={filteredPosts}
          initialCasts={filteredPosts}
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
