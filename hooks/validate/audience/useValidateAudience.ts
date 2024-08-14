"use client"

import { useMemo } from "react"

import {
  categorizeAudienceByChannel,
  generateAudienceSegments,
} from "@/lib/helpers"
import {
  formatChartData,
  generateChartConfig,
} from "@/lib/helpers/charts/audience"

// this hook will be use to calculate the respective audience stats based on the respective posts found for a given idea
const useValidateAudience = (posts: any[]) => {
  const audienceSegmentData = useMemo(() => {
    return generateAudienceSegments(posts)
  }, [posts])

  const audienceChannelData = useMemo(() => {
    return categorizeAudienceByChannel(posts)
  }, [posts])

  const postsCountChartsData = useMemo(() => {
    return formatChartData(audienceSegmentData, "postCount")
  }, [audienceSegmentData])
  const postsCountChartConfig = useMemo(() => {
    return generateChartConfig(
      "Post Count",
      "var(--chart-1)",
      "var(--background)"
    )
  }, [])

  const postsByChannelCountChartsData = useMemo(() => {
    return formatChartData(audienceChannelData, "postCount")
  }, [audienceChannelData])
  const postsByChannelCountChartConfig = useMemo(() => {
    return generateChartConfig(
      "Post Count",
      "var(--chart-1)",
      "var(--background)"
    )
  }, [])

  const totalLikesChartConfig = useMemo(() => {
    return generateChartConfig(
      "Total Likes",
      "var(--chart-2)",
      "var(--background)"
    )
  }, [])
  const totalRecastsConfig = useMemo(() => {
    return generateChartConfig(
      "Total Recasts",
      "var(--chart-3)",
      "var(--background)"
    )
  }, [])
  const totalRepliesConfig = useMemo(() => {
    return generateChartConfig(
      "Total Replies",
      "var(--chart-4)",
      "var(--background)"
    )
  }, [])

  const totalLikesData = useMemo(() => {
    return formatChartData(audienceSegmentData, "engagementStats.totalLikes")
  }, [audienceSegmentData])

  const totalRecastsData = useMemo(() => {
    return formatChartData(audienceSegmentData, "engagementStats.totalRecasts")
  }, [audienceSegmentData])

  const totalRepliesData = useMemo(() => {
    return formatChartData(audienceSegmentData, "engagementStats.totalReplies")
  }, [audienceSegmentData])

  return {
    postsCountChartConfig,
    postsCountChartsData,
    totalLikesChartConfig,
    postsByChannelCountChartsData,
    postsByChannelCountChartConfig,
    totalLikesData,
    totalRecastsConfig,
    totalRecastsData,
    totalRepliesConfig,
    totalRepliesData,
  }
}

export default useValidateAudience
