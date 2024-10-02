import { FC } from "react"
import { Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  categorizeArrayOfPosts,
  generateWhimsicalErrorMessages,
  searchPostsForCategories,
  sortPostsByProperty,
} from "@/lib/helpers"
import Banner from "@/components/banner"
import PostsFeed from "@/components/feed/castsAndTweets"
import Filterbox from "@/components/filterbox"
import FilterBar from "@/components/filters/FilterBar/new"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import Rankings from "@/components/rankings"
import RedirectButton from "@/components/redirect/Button"
import SortCasts from "@/components/sort/new"
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

const IndexPage: FC<IndexPageProps> = async ({ searchParams }) => {
  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const sortParam = parseQueryParam(searchParams.sort)
  const userFilterParam = parseQueryParam(searchParams.connected)

  const shouldHideCasts =
    filtersParam && filtersParam.includes("hide-farcaster")
  const shouldHideTweets = filtersParam && filtersParam.includes("hide-twitter")

  // fetch both tweets and posts and can seperate

  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = notionAccessCode
    ? await searchNotion(notionAccessCode)
    : { results: [] }
  const notionResults = notionSearch.results

  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined

  let castsAndTweets = await fetchPosts({
    timePeriod: timeFilterParam ?? "7-days",
    channelId: "someone-build",
    // sortField: sortParam as any,
    userFID: userFilterParam,
  })

  const categories = categorizeArrayOfPosts(castsAndTweets) as Category[]
  if (categoryParam.length) {
    castsAndTweets = searchPostsForCategories(castsAndTweets, categoryParam)
  }
  if (sortParam && sortParam.length) {
    castsAndTweets = sortPostsByProperty(castsAndTweets, sortParam)
  }

  const isError = !castsAndTweets && castsAndTweets.length
  const onlyCasts = filterForOnlyCastsOrTweets("cast", castsAndTweets)
  const onlyTweets = filterForOnlyCastsOrTweets("tweet", castsAndTweets)

  return (
    <>
      <Banner
        titleText="Discover top product requests"
        descriptionText="Discover top product requests to supercharge your roadmap "
      />
      <div className="top-66 sticky z-10 w-full lg:hidden">
        <FilterBar categories={categories} posts={castsAndTweets} />
      </div>{" "}
      <section className="mx-auto grid w-full grid-cols-1 py-6 md:container sm:px-6 lg:grid-cols-12 lg:gap-x-10 lg:px-6">
        <main className="col-span-1 flex w-full flex-col items-center gap-x-4 md:items-start  lg:col-span-9 lg:justify-start">
          <div className="flex w-full flex-col items-center justify-between lg:flex-row">
            <Header />
            <div className=" hidden  lg:flex lg:flex-row lg:gap-x-2">
              <SortCasts />

              <Filterbox categories={categories} />
            </div>
          </div>
          {/* <FilterBarDesktop
            initialCasts={castsAndTweets}
            posts={castsAndTweets}
          /> */}

          <article className="no-scrollbar lg:col-span-9 lg:px-2  ">
            {isError ? (
              <ErrorDisplay
                searchTerm={searchTerm}
                filtersParam={filtersParam}
                categoryParam={categoryParam}
              />
            ) : (
              <div className=" flex flex-col gap-y-4 px-2 lg:px-0">
                <PostsFeed
                  timeFilterParam={timeFilterParam}
                  nextCursor={""}
                  columns={"grid-cols-1"}
                  renderCardsAsSingleRow={true}
                  notionResults={notionResults}
                  posts={castsAndTweets}
                />
              </div>
            )}
          </article>
        </main>
        <aside className="no-scrollbar sticky top-0 hidden h-screen gap-y-6 overflow-auto sm:sticky lg:col-span-3 lg:flex lg:flex-col">
          <Rankings casts={onlyCasts} posts={castsAndTweets} />
        </aside>
      </section>
      <div className="flex flex-col items-start lg:hidden">
        <BottomMobileNav
          filteredPosts={castsAndTweets}
          initialCasts={onlyCasts}
        />
      </div>
    </>
  )
}

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="flex flex-col items-center gap-2 md:pb-10 lg:items-start  ">
      <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
        Top product requests <br className="hidden sm:inline" />
      </h1>
      <p className="text-center text-xs sm:text-lg md:text-left lg:max-w-[700px]">
        Sourced from <span className="font-semibold">Farcaster and X </span>
      </p>
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

export default IndexPage

{
  /* <aside className="no-scrollbar col-span- sticky top-0 hidden h-screen flex-col gap-y-6 overflow-auto  pb-10 lg:col-span-2 lg:flex">


<DateFilters />
<UserFilters />
<CategoriesFeed categories={categories} />
</aside> 
*/
}
