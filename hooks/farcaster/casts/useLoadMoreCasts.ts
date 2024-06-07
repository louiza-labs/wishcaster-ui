import { useCallback, useEffect, useState } from "react"
import { Cast as CastType } from "@/types"
import { useNeynarContext } from "@neynar/react"
import { useInView } from "react-intersection-observer"

import { calculateStartDate, debounce } from "@/lib/utils"
import { fetchChannelCasts } from "@/app/actions"

type dateRanges = "24-hours" | "7-days" | "30-days" | "ytd"

export const useLoadMoreCasts = (
  initialCasts: CastType[],
  initialCursor: string,
  dateRange = ""
) => {
  const [castsToShow, setCastsToShow] = useState<CastType[]>(initialCasts)
  const [cursorToUse, setCursorToUse] = useState<string>(initialCursor)
  const [fetchingCasts, setFetchingCasts] = useState(false)
  const [isRangeCovered, setIsRangeCovered] = useState<boolean>(false)

  const { ref, inView } = useInView()
  const { user } = useNeynarContext()
  const loggedInUserFID = Number(user?.fid) ?? 0

  useEffect(() => {
    if (dateRange && dateRange.length && initialCasts.length) {
      const startDate = calculateStartDate(dateRange as dateRanges)
      const filteredCasts = initialCasts.filter(
        (cast) => new Date(cast.timestamp) >= startDate
      )
      setCastsToShow(filteredCasts)
      setIsRangeCovered(false)
    }
  }, [initialCasts, dateRange])

  const loadInitialCasts = useCallback(async () => {
    setFetchingCasts(true)
    try {
      const castsResponse = await fetchChannelCasts(
        "someone-build",
        "",
        loggedInUserFID
      )
      const newCasts = castsResponse.casts
      // const taglines = await fetchTaglines(newCasts)
      // const castsWithTaglines = addTaglinesToCasts(newCasts, taglines)
      setCastsToShow((prevCasts) => [...prevCasts, ...newCasts])
    } catch (error) {
      console.error("Error fetching casts:", error)
    } finally {
      setFetchingCasts(false)
    }
  }, [loggedInUserFID])

  useEffect(() => {
    if (castsToShow.length === 0) {
      loadInitialCasts()
    }
  }, [loggedInUserFID, castsToShow.length, loadInitialCasts])

  const loadMoreCasts = useCallback(async () => {
    if (!isRangeCovered && cursorToUse) {
      setFetchingCasts(true)
      try {
        const castsResponse = await fetchChannelCasts(
          "someone-build",
          cursorToUse,
          loggedInUserFID
        )
        const newCasts = castsResponse.casts

        const newCursor = castsResponse.nextCursor
        const startDate = calculateStartDate(dateRange as dateRanges)

        if (
          newCasts.length &&
          new Date(newCasts[newCasts.length - 1].timestamp) < startDate
        ) {
          setIsRangeCovered(true)
        } else {
          setCastsToShow((prevCasts) => [...prevCasts, ...newCasts])
          setCursorToUse(newCursor)
        }
      } catch (error) {
        console.error("Error fetching casts:", error)
      } finally {
        setFetchingCasts(false)
      }
    }
  }, [cursorToUse, isRangeCovered, loggedInUserFID, dateRange])

  useEffect(() => {
    if (inView && !isRangeCovered && castsToShow.length > 0) {
      const debouncedLoadMore = debounce(loadMoreCasts, 500)
      const timer = setTimeout(debouncedLoadMore, 1000)
      return () => clearTimeout(timer)
    }
  }, [inView, loadMoreCasts, isRangeCovered, castsToShow.length])

  return { castsToShow, ref, isRangeCovered, fetchingCasts }
}

export default useLoadMoreCasts
