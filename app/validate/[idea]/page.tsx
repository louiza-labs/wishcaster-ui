import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
  addUserInfoToTweets,
  categorizeArrayOfCasts,
  extractUserIdsFromTweets,
  generateWhimsicalErrorMessages,
  removeDuplicateTweets,
  sortCastsByProperty,
} from "@/lib/helpers"
import { Breadcrumbs } from "@/components/breadcrumbs"
import FilterBar from "@/components/filters/FilterBar"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import RedirectButton from "@/components/redirect/Button"
import ValidateTabs from "@/components/validate/tabs"
import {
  fetchCastsUntilCovered,
  fetchChannelCasts,
  fetchTweets,
  fetchTwitterUsers,
  getUsersNotionAccessCode,
  searchNotion,
  searchPostsWithKeywordsV2,
} from "@/app/actions"

interface CastPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
  params: {
    idea: string
  }
}
function cleanSearchTerm(searchTerm: string): string {
  // Decode the URL-encoded string
  const decodedTerm = decodeURIComponent(searchTerm)

  // Clean up the search term by trimming spaces and converting to lowercase
  const cleanedTerm = decodedTerm.trim().toLowerCase()

  return cleanedTerm
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

const ValidateIdeaPage: FC<CastPageProps> = async ({
  searchParams,
  params,
}) => {
  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const sortParam = parseQueryParam(searchParams.sort)

  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = notionAccessCode
    ? await searchNotion(notionAccessCode)
    : { results: [] }
  const notionResults = notionSearch.results

  const searchIdea = cleanSearchTerm(params.idea)

  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined

  const { casts: initialCasts, nextCursor: cursorToUse } = !timeFilterParam
    ? await fetchChannelCasts("someone-build")
    : await fetchCastsUntilCovered(
        "someone-build",
        timeFilterParam as "24-hours" | "7-days" | "30-days" | "ytd"
      )

  const { data: tweets } = await fetchTweets()
  let tweetsWithoutDuplicates = removeDuplicateTweets(tweets)

  const users = await fetchTwitterUsers(
    extractUserIdsFromTweets(tweetsWithoutDuplicates)
  )

  const tweetsWithUsers = addUserInfoToTweets(
    tweetsWithoutDuplicates,
    users?.data
  )

  let filteredPosts = initialCasts
  const categories = categorizeArrayOfCasts([
    ...filteredPosts,
    ...tweetsWithUsers,
  ]) as Category[]
  const mobileViewParam = parseQueryParam(searchParams.view)

  filteredPosts = addCategoryFieldsToCasts(
    [...filteredPosts, ...tweetsWithUsers],
    categories
  ) as CastType[]
  // const res = true ? null : await uploadPostsDataToAlgolia(filteredPosts)
  const searchResults = await searchPostsWithKeywordsV2(
    filteredPosts,
    searchIdea
  )
  // const searchResultsFromAlgolia = await searchPostsData(searchIdea)
  // console.log("the search res from alg", searchResultsFromAlgolia)
  let topCast = searchResults.length === 1 ? searchResults[0] : undefined
  const sortedCasts = sortCastsByProperty(searchResults, "likes_count")
  topCast = topCast ? topCast : sortedCasts[0]

  const isError = !searchResults.length || !searchIdea
  const breadCrumbPages = [
    { name: "Validate", link: "/validate" },
    {
      name: searchIdea ? searchIdea : params.idea,
      link: `/validate/${params.idea}`,
    },
  ]

  return (
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
              {searchIdea}
            </h1>
            <div className="hidden flex-row items-center gap-x-2 md:flex">
              {/* <div className="flex flex-wrap gap-1">
                {Array.from(selectedTopic?.keywords || []).map((keyword) => (
                  <Badge
                    variant={"outline"}
                    key={keyword}
                    className="text-sm font-light"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div> */}
            </div>
          </div>
        </div>
        <main className="relative grid min-h-screen grid-cols-1 gap-4 lg:mt-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="col-span-12 flex w-full flex-col items-center px-20">
            <ValidateTabs tweetsAndCasts={searchResults} />
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

export default ValidateIdeaPage
