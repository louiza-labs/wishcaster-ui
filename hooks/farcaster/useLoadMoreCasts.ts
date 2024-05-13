import { useCallback, useEffect, useState } from "react"
import { Cast as CastType } from "@/types"
import { useInView } from "react-intersection-observer"

import { debounce } from "@/lib/helpers"
import { fetchChannelCasts } from "@/app/actions"

export const useLoadMoreCasts = (
  initialCasts: CastType[],
  initialCursor: string
) => {
  const [castsToShow, setCastsToShow] = useState<CastType[]>(initialCasts)
  const [cursorToUse, setCursorToUse] = useState<string>(initialCursor)
  const { ref, inView } = useInView()

  const loadMoreCasts = useCallback(async () => {
    try {
      const castsResponse = await fetchChannelCasts(
        "someone-build",
        cursorToUse
      )
      const newCasts = castsResponse.casts
      const newCursor: any = castsResponse.nextCursor
      setCastsToShow((prevCasts: any) => [...prevCasts, ...newCasts])
      setCursorToUse(newCursor)
    } catch (error) {
      console.error("Error fetching casts:", error)
    }
  }, [cursorToUse])

  useEffect(() => {
    if (inView) {
      const debouncedLoadMore = debounce(loadMoreCasts, 500)
      const timer = setTimeout(() => {
        debouncedLoadMore()
      }, 1000) // Adjust the delay as needed
      return () => clearTimeout(timer)
    }
  }, [inView, loadMoreCasts])

  return { castsToShow, ref }
}
