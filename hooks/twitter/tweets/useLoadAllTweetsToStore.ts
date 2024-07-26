"use client"

import { useEffect } from "react"
import { useBoundStore } from "@/store"
import { useNeynarContext } from "@neynar/react"

import {
  fetchTweetsUntilCovered,
  fetchTwitterUsersUntilCovered,
} from "@/app/actions"

export const useLoadAllTweetsToStore = () => {
  const loadTweetsToStore = useBoundStore((state: any) => state.setTweets)
  const tweetsFromStore = useBoundStore((state: any) => state.tweets)

  const { user, isAuthenticated } = useNeynarContext()

  const loadTweets = async () => {
    try {
      const tweetsResponse = await fetchTweetsUntilCovered()

      const newTweets = tweetsResponse.tweets
      const arrayOfStringsOfUserIds = newTweets.map((tweet) => tweet.author_id)
      const usersResponse = await fetchTwitterUsersUntilCovered(
        arrayOfStringsOfUserIds
      )
      const arrayOfUsers = usersResponse.tweets

      const tweetsWithUsers = newTweets.map((tweet: any) => {
        const userForTweet = arrayOfUsers.find(
          (user) => user.id === tweet.author_id
        )
        return {
          ...tweet,
          user: userForTweet,
          hash: tweet.id,
          type: "tweet",
        }
      })
      // const taglinesWithHashes = await fetchTaglines(newCasts)
      // const castsWithTaglines = addTaglinesToCasts(newCasts, taglinesWithHashes)
      loadTweetsToStore(tweetsWithUsers)
    } catch (error) {}
  }

  useEffect(() => {
    if (!(tweetsFromStore && tweetsFromStore.length)) {
      loadTweets()
    }
  }, [])

  return {}
}

export default useLoadAllTweetsToStore
