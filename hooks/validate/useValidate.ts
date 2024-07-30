"use client"

import { useState } from "react"

import { summarizeByAuthor, summarizePosts } from "@/lib/helpers"

const useValidate = (castsAndTweets: any) => {
  const [engagementStatsArray, setEngagementStatsArray] = useState([])

  const rawStatsMetricsForPosts = summarizePosts(castsAndTweets)
  const rawStatsbyUsers = summarizeByAuthor(castsAndTweets)

  return {
    rawStatsMetricsForPosts,
    rawStatsbyUsers,
  }
}

export default useValidate
