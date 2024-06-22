"use client"

import { useCallback, useEffect, useState } from "react"
import { useNeynarContext } from "@neynar/react"

import { fetchFarcasterCastForUsers } from "@/app/actions"

const useFetchCastsForUser = () => {
  const { user } = useNeynarContext()
  const [casts, setCasts] = useState([])
  const [fetchingCasts, setFetchingCasts] = useState(false)
  const [errorFetchingCasts, setErrorFetchingCasts] = useState(false)

  const fetchAndSetCasts = useCallback(async () => {
    if (user && user.fid) {
      try {
        setFetchingCasts(true)
        setErrorFetchingCasts(false)
        const fetchedCasts = await fetchFarcasterCastForUsers(
          user.fid,
          user.fid
        )
        if (fetchedCasts.casts) {
          setCasts(fetchedCasts.casts)
        }
      } catch (e) {
        setErrorFetchingCasts(true)
        setFetchingCasts(false)
      }
    }
  }, [user])

  useEffect(() => {
    if (user && user.fid) {
      fetchAndSetCasts()
    }
  }, [user, fetchAndSetCasts])

  return {
    casts,
    fetchingCasts,
    errorFetchingCasts,
  }
}

export default useFetchCastsForUser
