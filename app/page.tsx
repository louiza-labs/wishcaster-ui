import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
  addCategoryFieldsToTweets,
  addMediaToTweets,
  addUserInfoToTweets,
  categorizeArrayOfCasts,
  extractUserIdsFromTweets,
  generateWhimsicalErrorMessages,
  removeDuplicateTweets,
  searchCastsForCategories,
  sortCastsByProperty,
} from "@/lib/helpers"
import CastAndTweetsFeed from "@/components/feed/castsAndTweets"
import Filters from "@/components/filters"
import FilterBar from "@/components/filters/FilterBar"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import Rankings from "@/components/rankings"
import RedirectButton from "@/components/redirect/Button"
import SortCasts from "@/components/sort/SortCasts"
import {
  fetchTweets,
  fetchTwitterUsers,
  getAndAddReferencedTweets,
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

const IndexPage: FC<IndexPageProps> = async ({ searchParams }) => {
  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const sortParam = parseQueryParam(searchParams.sort)
  const shouldHideCasts =
    filtersParam && filtersParam.includes("hide-farcaster")
  const shouldHideTweets = filtersParam && filtersParam.includes("hide-twitter")
  const tweets = !shouldHideTweets
    ? await fetchTweets()
    : { data: [], includes: {} }

  let tweetsWithoutDuplicates = !shouldHideTweets
    ? removeDuplicateTweets(tweets?.data)
    : []
  const tweetsWithMediaAdded = addMediaToTweets(
    tweetsWithoutDuplicates,
    tweets.includes
  )
  const users = !shouldHideTweets
    ? await fetchTwitterUsers(extractUserIdsFromTweets(tweetsWithMediaAdded))
    : { data: [] }
  const tweetsWithUsers = !shouldHideTweets
    ? addUserInfoToTweets(tweetsWithMediaAdded, users?.data)
    : []
  const tweetsWithReferenceTweetsAdded = await getAndAddReferencedTweets(
    tweetsWithUsers
  )
  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = notionAccessCode
    ? await searchNotion(notionAccessCode)
    : { results: [] }
  const notionResults = notionSearch.results

  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined

  // commenting out casts since its not relevant here

  // const { casts: initialCasts, nextCursor: cursorToUse } = !shouldHideCasts
  //   ? !timeFilterParam
  //     ? await fetchCastsUntilCovered("someone-build", "7-days")
  //     : await fetchCastsUntilCovered(
  //         "someone-build",
  //         timeFilterParam as "24-hours" | "7-days" | "30-days" | "ytd"
  //       )
  //   : { casts: [], nextCursor: "" }
  let cursorToUse = ""
  let initialCasts: any[] = []
  let filteredPosts = initialCasts
  const categories = categorizeArrayOfCasts([
    ...filteredPosts,
    ...tweetsWithUsers,
  ]) as Category[]
  // let taglinedCasts = await fetchTaglines(filteredPosts)
  filteredPosts = addCategoryFieldsToCasts(
    filteredPosts,
    categories
  ) as Array<CastType>
  let tweetsWithCategories = addCategoryFieldsToTweets(
    tweetsWithReferenceTweetsAdded,
    categories
  )

  // if (filteredPosts.length) {
  //   filteredPosts = addTaglinesToCasts(filteredPosts, taglinedCasts)
  // }
  if (categoryParam.length) {
    filteredPosts = searchCastsForCategories(filteredPosts, categoryParam)
    tweetsWithCategories = searchCastsForCategories(
      tweetsWithCategories,
      categoryParam
    )
  }
  if (sortParam) {
    filteredPosts = sortCastsByProperty(
      [...filteredPosts, ...tweetsWithCategories],
      sortParam
    )
  }

  const isError = ![...tweetsWithCategories, ...filteredPosts].length

  return (
    <>
      <div className="top-66 sticky z-10 lg:hidden">
        <FilterBar initialCasts={tweetsWithCategories} />
      </div>{" "}
      <section className="mx-auto py-6 md:container sm:px-6 lg:px-6">
        <Header />
        <main className="relative grid grid-cols-1 gap-4 lg:grid-cols-12 ">
          <aside className="no-scrollbar sticky top-0 hidden h-screen w-fit flex-col gap-y-6 overflow-auto  pb-10 lg:col-span-2 lg:flex">
            {/* <CardLayoutToggle /> */}
            <SortCasts />
            <Filters initialCasts={tweetsWithCategories} />
          </aside>
          <article className="no-scrollbar lg:col-span-8 lg:px-2  ">
            {isError ? (
              <ErrorDisplay
                searchTerm={searchTerm}
                filtersParam={filtersParam}
                categoryParam={categoryParam}
              />
            ) : (
              <CastAndTweetsFeed
                casts={filteredPosts}
                timeFilterParam={timeFilterParam}
                nextCursor={cursorToUse}
                notionResults={notionResults}
                tweets={tweetsWithCategories}
              />
            )}
          </article>
          <aside className="no-scrollbar sticky top-0 hidden h-screen gap-y-6 overflow-auto sm:sticky lg:col-span-2 lg:flex lg:flex-col">
            <Rankings
              casts={initialCasts}
              castsAndOrTweets={[...filteredPosts, ...tweetsWithCategories]}
            />
          </aside>
        </main>
      </section>
      <div className="flex flex-col items-start lg:hidden">
        <BottomMobileNav
          filteredPosts={filteredPosts}
          initialCasts={tweetsWithCategories}
        />
      </div>
    </>
  )
}

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="flex flex-col items-center gap-2 md:items-start md:pb-10">
      <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
        What (drone shows) people want! <br className="hidden sm:inline" />
      </h1>
      <p className="text-center text-xs sm:text-lg md:text-left lg:max-w-[700px]">
        Sourced from <span className="font-semibold">X </span>
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
