"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Cast as CastType } from "@/types"
import { useNeynarContext } from "@neynar/react"

import { fetchTwitterUsersUntilCovered } from "@/app/actions"

export const useAddUsersToTweets = (tweets: any[]) => {
  const [tweetsWithUsers, setTweetsWithUsers] = useState<CastType[]>(tweets)
  const [cursorToUse, setCursorToUse] = useState<string>("")
  const [fetching, setFetching] = useState<boolean>(false)
  const searchParams = useSearchParams()

  const { user, isAuthenticated } = useNeynarContext()
  const loggedInUserFID = Number(user?.fid) ?? 0

  const filtersFromParams = searchParams.getAll("filters")

  const loadTweetsWithUsers = useCallback(async () => {
    try {
      setFetching(true)
      const arrayOfStringsOfUserIds = tweets
        .filter((tweet) => !(tweet.object === "cast"))
        .map((tweet) => tweet.author_id)
      console.log("the arrayOfStringsOfUserIds", arrayOfStringsOfUserIds)

      const usersResponse = await fetchTwitterUsersUntilCovered(
        arrayOfStringsOfUserIds
      )

      const users = usersResponse.tweets
      console.log("the users", users)
      const tweetsWithUsersAdded = tweets.map((tweet) => {
        const userForTweet = users.find((user) => user.id === tweet.author_id)
        return {
          ...tweet,
          user: userForTweet,
        }
      })
      // const taglinesWithHashes = await fetchTaglines(newCasts)
      // const castsWithTaglines = addTaglinesToCasts(newCasts, taglinesWithHashes)
      setTweetsWithUsers(tweetsWithUsersAdded)
      setFetching(false)
    } catch (error) {
      setFetching(false)
    }
  }, [tweets])

  useEffect(() => {
    if (tweets && tweets.length) {
      loadTweetsWithUsers()
    }
  }, [loadTweetsWithUsers, tweets])

  return { tweetsWithUsers, fetching }
}

export default useAddUsersToTweets
