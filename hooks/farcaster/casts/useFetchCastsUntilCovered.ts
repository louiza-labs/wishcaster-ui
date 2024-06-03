"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Cast as CastType } from "@/types"
import { useNeynarContext } from "@neynar/react"

import { fetchCastsUntilCovered } from "@/app/actions"

export const useFetchCastsUntilCovered = (initialCasts: CastType[]) => {
  const [castsToShow, setCastsToShow] = useState<CastType[]>(initialCasts)
  const [cursorToUse, setCursorToUse] = useState<string>("")
  const [fetchingCasts, setFetchingCasts] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const dateOptions = ["24-hours", "7-days", "30-days", "ytd"]

  const { user, isAuthenticated } = useNeynarContext()
  const loggedInUserFID = Number(user?.fid) ?? 0

  const filtersFromParams = searchParams.getAll("filters")
  const selectedDateFilter =
    (filtersFromParams.find((filter) => dateOptions.includes(filter)) as any) ??
    "ytd"

  const loadCasts = useCallback(async () => {
    try {
      setFetchingCasts(true)
      const castsResponse = await fetchCastsUntilCovered(
        "someone-build",
        selectedDateFilter && selectedDateFilter.length
          ? selectedDateFilter
          : "ytd",
        loggedInUserFID
      )
      const newCasts = castsResponse.casts
      const newCursor: any = castsResponse.nextCursor
      setCastsToShow(newCasts)
      setFetchingCasts(false)
      setCursorToUse(newCursor)
    } catch (error) {
      setFetchingCasts(false)

      console.error("Error fetching casts:", error)
    }
  }, [loggedInUserFID])

  useEffect(() => {
    loadCasts()
  }, [loggedInUserFID, loadCasts])

  return { castsToShow, cursorToUse, fetchingCasts }
}

export default useFetchCastsUntilCovered
