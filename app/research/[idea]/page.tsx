import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
  addMetricsToProblems,
  categorizeArrayOfCasts,
  matchIdeasToPosts,
  sortCastsByProperty,
} from "@/lib/helpers"
import {
  formatAudienceData,
  generateAudienceSegments,
  generateDemandScoreAndBenchmarkData,
  generateStatsForPosts,
} from "@/lib/helpers/summary"
import { Breadcrumbs } from "@/components/breadcrumbs"
import FilterBar from "@/components/filters/FilterBar"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import ValidateRows from "@/components/research"
import ValidateSearch from "@/components/search/ValidateSearch"
import {
  fetchPosts,
  fetchTweetsWithSearch,
  generateProblemsAndSentimentScores,
  generateSimilarIdeas,
  generateSummaryForIdea,
  getUsersNotionAccessCode,
  searchNotion,
  searchPostsWithKeywordsV2,
} from "@/app/actions"

interface ResearchPageProps {
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

function extractKeywordsFromProjects(projects: any) {
  const keywords = new Set()

  projects.forEach((project: any) => {
    const { name, description } = project

    // Tokenize and process name and description to extract keywords
    const nameTokens = name.split(" ").map((token: any) => token.toLowerCase())
    const descriptionTokens = description
      .replace(/[.,]/g, "") // Remove punctuation
      .split(" ")
      .map((token: string) => token.toLowerCase())

    // Add tokens to the set of keywords
    nameTokens.forEach((token: any) => keywords.add(token))
    descriptionTokens.forEach((token: any) => keywords.add(token))
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

const getSummary = async (
  idea: string,
  industry: string,
  posts: any,
  similarPosts: any,
  relevantProblems: any
) => {
  try {
    const metricsForPosts = generateStatsForPosts(posts)
    const postsWithIdeasAdded = posts.map((posts: any) => {
      return {
        ...posts,
        idea: idea,
      }
    })
    const { userDemandScore: demandScore, benchmarkData: benchmarkStats } =
      generateDemandScoreAndBenchmarkData(
        [...similarPosts, ...postsWithIdeasAdded],
        idea
      )

    const statsForIdea = metricsForPosts.overall
    const audienceSegmentData = generateAudienceSegments(posts)
    const relevantAudience = formatAudienceData(
      audienceSegmentData,
      "postCount"
    )
    const summary = await generateSummaryForIdea({
      idea,
      industry,
      demandScore,
      statsForIdea,
      benchmarkStats,
      relevantAudience,
      relevantProblems,
    })
    return summary
  } catch (e) {}
}

const ValidateIdeaPage: FC<ResearchPageProps> = async ({
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

  const posts = await fetchPosts({
    timePeriod: timeFilterParam ? timeFilterParam : "ytd",
    channelId: "someone-build",
    searchTerm: searchIdea,
  })

  const categories = categorizeArrayOfCasts(posts) as Category[]
  const mobileViewParam = parseQueryParam(searchParams.view)

  const problemsResponse = await generateProblemsAndSentimentScores(
    searchIdea,
    industry,
    posts
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
    ...posts,
    ...(tweetsForSimilarIdeas && tweetsForSimilarIdeas.length
      ? tweetsForSimilarIdeas
      : []),
  ]) as Category[]

  let filteredPostsWithSimilarIdeas = addCategoryFieldsToCasts(
    [
      ...posts,
      ...(tweetsForSimilarIdeas && tweetsForSimilarIdeas.length
        ? tweetsForSimilarIdeas
        : []),
    ],
    categoriesForSimilarIdeas
  ) as CastType[]
  const keywordsFromSimilarIdeas: any =
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

  const generatedSummary = await getSummary(
    searchIdea,
    industry,
    posts,
    postsWithSimilarIdeasWithIdeasAdded,
    problemsResponse
  )

  // use initial casts pull and new tweets and filter again

  // const searchResultsFromAlgolia = await searchPostsData(searchIdea)
  // console.log("the search res from alg", searchResultsFromAlgolia)
  let topCast = posts.length === 1 ? posts[0] : undefined
  const sortedCasts = sortCastsByProperty(posts, "likes_count")
  topCast = topCast ? topCast : sortedCasts[0]

  const isError = !posts.length || !searchIdea
  const breadCrumbPages = [
    { name: "Research", link: "/research" },
    {
      name: searchIdea ? searchIdea : params.idea,
      link: `/research/${params.idea}`,
    },
  ]
  const problemsWithMetrics = addMetricsToProblems(problemsResponse, posts)

  return (
    <>
      <div className="top-66 sticky z-10">
        <FilterBar initialCasts={posts} posts={posts} />
      </div>
      <section className="mx-auto h-fit py-6 md:container sm:px-6 lg:h-auto lg:px-10 xl:flex xl:flex-row">
        <div className="flex flex-col">
          <div className="px-6 md:px-0">
            <Breadcrumbs pages={breadCrumbPages} />
          </div>

          {!(posts && posts.length) ? (
            <div className="flex w-full flex-col items-center">
              <div className="flex w-full flex-col items-center justify-center gap-y-3">
                <p className="text-center text-2xl font-semibold">
                  No results found, try searching again
                </p>
                <ValidateSearch />
              </div>
            </div>
          ) : (
            <main className="relative grid min-h-screen grid-cols-1 gap-4  lg:grid-cols-12 ">
              <div className="col-span-12 flex w-full flex-col items-start">
                <ValidateRows
                  tweetsAndCasts={posts}
                  problems={problemsWithMetrics}
                  currentIdea={searchIdea}
                  ideaSummary={generatedSummary ?? ""}
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
