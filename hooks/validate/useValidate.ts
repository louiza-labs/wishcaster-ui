"use client"

import { useState } from "react"

import {
  addCategoryFieldsToCasts,
  addUserInfoToTweets,
  buildConfigForChart,
  categorizeArrayOfPosts,
  extractUserIdsFromTweets,
  formatDataForPiechart,
  removeDuplicateTweets,
  summarizeByAuthor,
  summarizeByAuthorAndPlatform,
  summarizePosts,
  transformAuthorSummariesForChart,
  transformSummaryForChartConfig,
  transformSummaryForPieChart,
} from "@/lib/helpers"
import {
  fetchCastsUntilCovered,
  fetchTweets,
  fetchTwitterUsers,
  searchPostsWithKeywordsV2,
} from "@/app/actions"

const useValidate = (castsAndTweets: any[], searchTerm = "") => {
  const [engagementStatsArray, setEngagementStatsArray] = useState<any[]>([])
  const [castAndTweetsSearchResults, setCastAndTweetsSearchResults] = useState<
    any[]
  >([])

  const summariesOfPosts = summarizePosts(castsAndTweets)
  const rawStatsMetricsForPosts = summariesOfPosts.overall
  const farcasterStatMetricsForPosts = summariesOfPosts.farcaster
  const twitterStatMetricsForPosts = summariesOfPosts.twitter

  const rawStatsbyUsers = summarizeByAuthor(castsAndTweets)

  const authorSummaries = summarizeByAuthorAndPlatform(castsAndTweets)
  const overallAuthorSummaries = authorSummaries.overall
  const farcasterAuthorSummaries = authorSummaries.farcaster
  const twitterAuthorSummaries = authorSummaries.twitter

  const overallEngagementKeysAndLabels = transformSummaryForChartConfig(
    rawStatsMetricsForPosts
  )
  const overallChartConfig = buildConfigForChart(overallEngagementKeysAndLabels)
  const formattedOverallDataForPieChart = formatDataForPiechart(
    transformSummaryForPieChart(rawStatsMetricsForPosts, overallChartConfig, [
      "bookmarks",
      "averageFollowerCount",
      "totalFollowers",
      "priorityLikes",
    ]),
    "interaction"
  )

  // For farcaster
  const farcasterChartKeysAndLabels = transformSummaryForChartConfig(
    farcasterStatMetricsForPosts
  )
  const farcasterChartConfig = buildConfigForChart(farcasterChartKeysAndLabels)
  const formattedFarcasterDataForPieChart = formatDataForPiechart(
    transformSummaryForPieChart(
      farcasterStatMetricsForPosts,
      farcasterChartConfig,
      ["bookmarks", "averageFollowerCount", "totalFollowers", "priorityLikes"]
    ),
    "interaction"
  )

  // For twitter
  const twitterChartKeysAndLabels = transformSummaryForChartConfig(
    twitterStatMetricsForPosts
  )
  const twitterChartConfig = buildConfigForChart(twitterChartKeysAndLabels)
  const formattedTwitterDataForPieChart = formatDataForPiechart(
    transformSummaryForPieChart(
      twitterStatMetricsForPosts,
      twitterChartConfig,
      ["bookmarks", "averageFollowerCount", "totalFollowers", "priorityLikes"]
    ),
    "interactions"
  )

  const avgFollowerBarchartData = [
    {
      platform: "Overall",
      averageFollowerCount: rawStatsMetricsForPosts.averageFollowerCount,
    },
    {
      platform: "Farcaster",
      averageFollowerCount: farcasterStatMetricsForPosts.averageFollowerCount,
    },
    {
      platform: "Twitter",
      averageFollowerCount: twitterStatMetricsForPosts.averageFollowerCount,
    },
  ]

  const chartLabels: any = {
    likes: "Likes",
    recasts: "Recasts",
    replies: "Replies",
    impressions: "Impressions",
    bookmarks: "Bookmarks",
    totalPosts: "Total Posts",
    followers: "Followers",
  }

  const overallChartKeysAndLabels = Object.keys(chartLabels).map((key) => ({
    key,
    label: chartLabels[key],
  }))

  const overallAuthorData = transformAuthorSummariesForChart(
    overallAuthorSummaries
  )

  const overallAuthorChartData = overallAuthorData.map((item) => ({
    author: item.author,
    likes: item.likes,
    recasts: item.recasts,
    replies: item.replies,
    impressions: item.impressions,
    bookmarks: item.bookmarks,
    totalPosts: item.totalPosts,
    followers: item.followers,
    fill: overallChartConfig.likes.color, // Set color based on your chart config
  }))

  const overallAuthorChartConfig = buildConfigForChart(
    overallChartKeysAndLabels
  )

  const farcasterAuthorData = transformAuthorSummariesForChart(
    farcasterAuthorSummaries
  )

  const farcasterAuthorChartData = farcasterAuthorData.map((item) => ({
    author: item.author,
    likes: item.likes,
    recasts: item.recasts,
    replies: item.replies,
    impressions: item.impressions,
    bookmarks: item.bookmarks,
    totalPosts: item.totalPosts,
    followers: item.followers,
    fill: farcasterChartConfig.likes.color,
  }))

  const farcasterAuthorChartConfig = buildConfigForChart(
    overallChartKeysAndLabels
  )

  const twitterAuthorData = transformAuthorSummariesForChart(
    twitterAuthorSummaries
  )

  const twitterAuthoChartData = twitterAuthorData.map((item) => ({
    author: item.author,
    likes: item.likes,
    recasts: item.recasts,
    replies: item.replies,
    impressions: item.impressions,
    bookmarks: item.bookmarks,
    totalPosts: item.totalPosts,
    followers: item.followers,
    fill: twitterChartConfig.likes.color,
  }))

  const twitterAuthorChartConfig = buildConfigForChart(
    overallChartKeysAndLabels
  )

  const cleanSearchTerm = (searchTerm: string): string => {
    const decodedTerm = decodeURIComponent(searchTerm)
    return decodedTerm.trim().toLowerCase()
  }

  const fetchAndFormatSearchResults = async () => {
    try {
      const cleanedTerm = cleanSearchTerm(searchTerm)
      const { casts: initialCasts } = await fetchCastsUntilCovered(
        "someone-build",
        "ytd"
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

      const combinedPosts = [...initialCasts, ...tweetsWithUsers]
      const categories: any = categorizeArrayOfPosts(combinedPosts)
      const filteredPosts = addCategoryFieldsToCasts(combinedPosts, categories)

      const searchResults = await searchPostsWithKeywordsV2(filteredPosts, [
        cleanedTerm,
      ])
      setCastAndTweetsSearchResults(searchResults)
    } catch (error) {
      console.error("Error in fetching and formatting search results:", error)
    }
  }

  return {
    engagementStatsArray,
    castAndTweetsSearchResults,
    fetchAndFormatSearchResults,
    rawStatsMetricsForPosts,
    farcasterChartConfig,
    twitterChartConfig,
    overallChartConfig,
    overallAuthorSummaries,
    rawStatsbyUsers,
    farcasterAuthorSummaries,
    twitterAuthorSummaries,
    formattedFarcasterDataForPieChart,
    formattedTwitterDataForPieChart,
    formattedOverallDataForPieChart,
    avgFollowerBarchartData,
    overallAuthorChartConfig,
    twitterAuthoChartData,
    twitterAuthorChartConfig,
    farcasterAuthorChartData,
    farcasterAuthorChartConfig,
    overallAuthorChartData,
  }
}

export default useValidate
