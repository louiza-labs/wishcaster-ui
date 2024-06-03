import { useCallback, useEffect, useState } from "react"
import { Cast as CastType } from "@/types"
import { useNeynarContext } from "@neynar/react"

import { fetchChannelCasts } from "@/app/actions"

export const useFetchInitialCasts = () => {
  const [castsToShow, setCastsToShow] = useState<CastType[]>([])
  const [cursorToUse, setCursorToUse] = useState<string>("")

  const { user, isAuthenticated } = useNeynarContext()
  const loggedInUserFID = Number(user?.fid) ?? 0

  const loadCasts = useCallback(async () => {
    try {
      const castsResponse = await fetchChannelCasts(
        "someone-build",
        "",
        loggedInUserFID
      )
      const newCasts = castsResponse.casts
      const newCursor: any = castsResponse.nextCursor
      setCastsToShow(newCasts)
      setCursorToUse(newCursor)
    } catch (error) {
      console.error("Error fetching casts:", error)
    }
  }, [])

  useEffect(() => {
    loadCasts()
  }, [loggedInUserFID])

  return { castsToShow, cursorToUse }
}

export default useFetchInitialCasts
