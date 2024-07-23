"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Cast as CastType } from "@/types"
import { useNeynarContext } from "@neynar/react"

import { fetchTweetsUntilCovered } from "@/app/actions"

export const useFetchTweetsUntilCovered = (initialTweets: any[]) => {
  const [tweetsToShow, setTweetsToShow] = useState<CastType[]>(initialTweets)
  const [cursorToUse, setCursorToUse] = useState<string>("")
  const [fetching, setFetching] = useState<boolean>(false)
  const searchParams = useSearchParams()

  const { user, isAuthenticated } = useNeynarContext()
  const loggedInUserFID = Number(user?.fid) ?? 0

  const filtersFromParams = searchParams.getAll("filters")

  const loadTweets = useCallback(async () => {
    try {
      setFetching(true)
      const tweetsResponse = await fetchTweetsUntilCovered()
      const newTweets = tweetsResponse.tweets
      // const taglinesWithHashes = await fetchTaglines(newCasts)
      // const castsWithTaglines = addTaglinesToCasts(newCasts, taglinesWithHashes)
      const newCursor: any = tweetsResponse.nextCursor
      setTweetsToShow(newTweets)
      setFetching(false)
      setCursorToUse(newCursor)
    } catch (error) {
      setFetching(false)
    }
  }, [])

  useEffect(() => {
    loadTweets()
  }, [loadTweets])

  return { tweetsToShow, cursorToUse, fetching }
}

export default useFetchTweetsUntilCovered
