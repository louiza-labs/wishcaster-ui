import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
  addMetricsToProblems,
  addUserInfoToTweets,
  categorizeArrayOfCasts,
  extractUserIdsFromTweets,
  matchIdeasToPosts,
  removeDuplicateTweets,
  sortCastsByProperty,
} from "@/lib/helpers"
import { Breadcrumbs } from "@/components/breadcrumbs"
import FilterBar from "@/components/filters/FilterBar"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import ValidateSearch from "@/components/search/ValidateSearch"
import ValidateRows from "@/components/validate"
import {
  fetchCastsUntilCovered,
  fetchChannelCasts,
  fetchTweetsWithSearch,
  fetchTwitterUsers,
  generateProblemsAndSentimentScores,
  generateSimilarIdeas,
  getUsersNotionAccessCode,
  searchNotion,
  searchPostsWithKeywordV2,
  searchPostsWithKeywordsV2,
} from "@/app/actions"

interface CastPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
  params: {
    idea: string
  }
}
function formatNamesForQuery(items: any) {
  const names = items.map((item: any) => `"${item.name}"`)
  return `(${names.join(" OR ")})`
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

function extractKeywordsFromProjects(projects) {
  const keywords = new Set()

  projects.forEach((project) => {
    const { name, description } = project

    // Tokenize and process name and description to extract keywords
    const nameTokens = name.split(" ").map((token) => token.toLowerCase())
    const descriptionTokens = description
      .replace(/[.,]/g, "") // Remove punctuation
      .split(" ")
      .map((token) => token.toLowerCase())

    // Add tokens to the set of keywords
    nameTokens.forEach((token) => keywords.add(token))
    descriptionTokens.forEach((token) => keywords.add(token))
  })

  // Convert Set to Array
  return Array.from(keywords)
}

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
  const industry = parseQueryParam(searchParams.industry)

  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = notionAccessCode
    ? await searchNotion(notionAccessCode)
    : { results: [] }

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

  const { data: tweets } = await fetchTweetsWithSearch(searchIdea)
  let tweetsWithoutDuplicates = removeDuplicateTweets(tweets ? tweets : [])

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
    ...(tweetsWithUsers && tweetsWithUsers.length ? tweetsWithUsers : []),
  ]) as Category[]
  const mobileViewParam = parseQueryParam(searchParams.view)

  filteredPosts = addCategoryFieldsToCasts(
    [
      ...filteredPosts,
      ...(tweetsWithUsers && tweetsWithUsers.length ? tweetsWithUsers : []),
    ],
    categories
  ) as CastType[]
  // const res = true ? null : await uploadPostsDataToAlgolia(filteredPosts)
  const searchResults = await searchPostsWithKeywordV2(
    filteredPosts,
    searchIdea
  )
  const problemsResponse = await generateProblemsAndSentimentScores(
    searchIdea,
    industry,
    searchResults
  )
  // creating baseline of similar ideas for comparisons
  const similarIdeasResponse = await generateSimilarIdeas(searchIdea, industry)
  // fetch tweets with ideas
  const stringOfSimilarIdeasForTweetsSearch =
    formatNamesForQuery(similarIdeasResponse)
  const { data: tweetsForSimilarIdeas } = await fetchTweetsWithSearch(
    stringOfSimilarIdeasForTweetsSearch
  )
  const categoriesForSimilarIdeas = categorizeArrayOfCasts([
    ...initialCasts,
    ...(tweetsForSimilarIdeas && tweetsForSimilarIdeas.length
      ? tweetsForSimilarIdeas
      : []),
  ]) as Category[]

  let filteredPostsWithSimilarIdeas = addCategoryFieldsToCasts(
    [
      ...initialCasts,
      ...(tweetsForSimilarIdeas && tweetsForSimilarIdeas.length
        ? tweetsForSimilarIdeas
        : []),
    ],
    categoriesForSimilarIdeas
  ) as CastType[]
  const keywordsFromSimilarIdeas =
    extractKeywordsFromProjects(similarIdeasResponse)

  const postsWithSimilarIdeasWithIdeasAdded = matchIdeasToPosts(
    similarIdeasResponse,
    filteredPostsWithSimilarIdeas
  )
  // const res = true ? null : await uploadPostsDataToAlgolia(filteredPosts)
  const searchResultsForSimilarIdeas = await searchPostsWithKeywordsV2(
    postsWithSimilarIdeasWithIdeasAdded,
    keywordsFromSimilarIdeas
  )

  // use initial casts pull and new tweets and filter again

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
  const problemsWithMetrics = addMetricsToProblems(
    problemsResponse,
    searchResults
  )

  return (
    <>
      <div className="top-66 sticky z-10">
        <FilterBar initialCasts={initialCasts} />
      </div>
      <section className="mx-auto h-fit py-6 md:container sm:px-6 lg:h-auto lg:px-10 xl:flex xl:flex-row">
        <div className="flex flex-col">
          <div className="px-6 md:px-0">
            <Breadcrumbs pages={breadCrumbPages} />
          </div>

          <div className="my-4 flex flex-col items-center justify-between gap-x-4 md:mt-4 md:flex-row">
            <div className=" flex w-full flex-row gap-x-2 px-6 md:mb-0 md:flex-col md:gap-x-0 md:gap-y-2 md:px-0">
              <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                {searchIdea}
              </h1>
            </div>
          </div>
          {!(searchResults && searchResults.length) ? (
            <div className="flex w-full flex-col items-center">
              <div className="flex w-full flex-col items-center justify-center gap-y-3">
                <p className="text-center text-2xl font-semibold">
                  No results found, try searching again
                </p>
                <ValidateSearch />
              </div>
            </div>
          ) : (
            <main className="relative grid min-h-screen grid-cols-1 gap-4  lg:grid-cols-12 lg:gap-x-10">
              <div className="col-span-12 flex w-full flex-col items-start">
                <ValidateRows
                  tweetsAndCasts={searchResults}
                  problems={problemsWithMetrics}
                  currentIdea={searchIdea}
                  tweetsAndCastsForSimilarIdeas={searchResultsForSimilarIdeas}
                />
              </div>
            </main>
          )}
        </div>
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

export default ValidateIdeaPage
