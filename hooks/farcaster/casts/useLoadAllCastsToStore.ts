"use client"

import { useCallback, useEffect } from "react"
import { useBoundStore } from "@/store"
import { useNeynarContext } from "@neynar/react"

import { fetchCastsUntilCovered } from "@/app/actions"

export const useLoadAllCastsToStore = () => {
  const loadCastsToStore = useBoundStore((state: any) => state.setCasts)
  const castsFromStore = useBoundStore((state: any) => state.casts)

  const { user, isAuthenticated } = useNeynarContext()
  const loggedInUserFID = Number(user?.fid) ?? 0

  const loadCasts = useCallback(async () => {
    try {
      const castsResponse = await fetchCastsUntilCovered(
        "someone-build",
        "ytd",
        loggedInUserFID
      )
      const newCasts = castsResponse.casts
      // const taglinesWithHashes = await fetchTaglines(newCasts)
      // const castsWithTaglines = addTaglinesToCasts(newCasts, taglinesWithHashes)
      loadCastsToStore(newCasts)
    } catch (error) {}
  }, [loggedInUserFID, loadCastsToStore])

  useEffect(() => {
    if (!castsFromStore.length) {
      loadCasts()
    }
  }, [loggedInUserFID, loadCasts])

  return {}
}

export default useLoadAllCastsToStore
