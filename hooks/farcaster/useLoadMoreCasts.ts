import { useCallback, useEffect, useState } from "react"
import { Cast as CastType } from "@/types"
import { useNeynarContext } from "@neynar/react"
import { useInView } from "react-intersection-observer"

import { calculateStartDate, debounce } from "@/lib/helpers"
import { fetchChannelCasts } from "@/app/actions"

export const useLoadMoreCasts = (
  initialCasts: CastType[],
  initialCursor: string,
  dateRange = "" as any
) => {
  const [castsToShow, setCastsToShow] = useState<CastType[]>(initialCasts)
  const [cursorToUse, setCursorToUse] = useState<string>(initialCursor)
  const [isRangeCovered, setIsRangeCovered] = useState<boolean>(false)

  const { ref, inView } = useInView()

  const getFarcasterFID = (user: any) => {
    if (
      user &&
      user.sessionId &&
      user.verifiedCredentials &&
      user.verifiedCredentials.length
    ) {
      const farcasterObj = user.verifiedCredentials.find(
        (credential: any) => credential.oauthProvider === "farcaster"
      )
      return farcasterObj.oauthAccountId
    }
  }
  const { user } = useNeynarContext()
  const loggedInUserFID = Number(user?.fid) ?? 0
  useEffect(() => {
    // Filter initial casts based on the date range when initialCasts or dateRange changes
    if (dateRange && dateRange.length) {
      const startDate = calculateStartDate(dateRange)
      const filteredCasts = initialCasts.filter(
        (cast) => new Date(cast.timestamp) >= startDate
      )

      setCastsToShow(filteredCasts)
      setIsRangeCovered(false) // Reset the range covered status when initial data changes
    }
  }, [initialCasts, dateRange])

  const loadMoreCasts = useCallback(async () => {
    if (!isRangeCovered && cursorToUse) {
      try {
        const castsResponse = await fetchChannelCasts(
          "someone-build",
          cursorToUse,
          loggedInUserFID
        )
        const newCasts = castsResponse.casts
        const newCursor: any = castsResponse.nextCursor
        const startDate = calculateStartDate(dateRange)
        // Check if the last cast's timestamp is earlier than the start date
        if (
          newCasts.length &&
          new Date(newCasts[newCasts.length - 1].timestamp) < startDate
        ) {
          setIsRangeCovered(true) // No more relevant data to load
        } else {
          setCastsToShow((prevCasts: any) => [...prevCasts, ...newCasts])
          setCursorToUse(newCursor)
        }
      } catch (error) {
        console.error("Error fetching casts:", error)
      }
    }
  }, [cursorToUse, loggedInUserFID])

  useEffect(() => {
    if (inView && !isRangeCovered) {
      const debouncedLoadMore = debounce(loadMoreCasts, 500)
      const timer = setTimeout(() => {
        debouncedLoadMore()
      }, 1000) // Adjust the delay as needed
      return () => clearTimeout(timer)
    }
  }, [inView, loadMoreCasts])

  return { castsToShow, ref, isRangeCovered }
}
