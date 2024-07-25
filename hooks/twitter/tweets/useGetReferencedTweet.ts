"use client"

import { useCallback, useEffect, useState } from "react"

import {
  addMediaToTweets,
  addUserInfoToTweets,
  extractUserIdsFromTweets,
} from "@/lib/helpers"
import { fetchTweetByIds, fetchTwitterUsers } from "@/app/actions"

export const useGetReferencedTweet = (referencedTweetId = "") => {
  const [referencedTweet, setReferencedTweet] = useState<any[]>()
  const [fetching, setFetching] = useState<boolean>(false)

  const loadTweets = useCallback(async () => {
    try {
      setFetching(true)
      const tweetsResponse = await fetchTweetByIds(referencedTweetId)
      const newTweets = tweetsResponse.data
      const users = await fetchTwitterUsers(
        extractUserIdsFromTweets([tweetsResponse?.data])
      )

      const tweetWithMedia = addMediaToTweets(
        [tweetsResponse.data],
        tweetsResponse.includes
      )

      const tweetsWithUsers = addUserInfoToTweets(tweetWithMedia, users?.data)
      // const taglinesWithHashes = await fetchTaglines(newCasts)
      // const castsWithTaglines = addTaglinesToCasts(newCasts, taglinesWithHashes)
      setReferencedTweet(tweetsWithUsers)
      setFetching(false)
    } catch (error) {
      setFetching(false)
    }
  }, [])

  useEffect(() => {
    if (referencedTweetId && referencedTweetId.length) {
      loadTweets()
    }
  }, [referencedTweetId])

  return { referencedTweet, fetching }
}

export default useGetReferencedTweet
