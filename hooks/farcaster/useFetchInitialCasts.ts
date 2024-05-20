import { useCallback, useEffect, useState } from "react"
import { Cast as CastType } from "@/types"

import { useDynamicContext } from "@/lib/dynamic"
import { fetchChannelCasts } from "@/app/actions"

export const useFetchInitialCasts = () => {
  const [castsToShow, setCastsToShow] = useState<CastType[]>([])
  const [cursorToUse, setCursorToUse] = useState<string>("")

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
      return farcasterObj?.oauthAccountId || ""
    }
    return ""
  }

  const { user, isAuthenticated } = useDynamicContext()
  const loggedInUserFID = getFarcasterFID(user)

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
