"use client"

import { useCallback, useEffect, useState } from "react"

import { fetchCastReactionsForUser } from "@/app/actions"

export const useFetchReactionsForUser = (userFID: number) => {
  const [reactions, setReactions] = useState<any[]>([])
  const [fetchingReactions, setFetchingReactions] = useState(false)
  const [errorFetchingReactions, setErrorFetchingReactions] = useState(false)
  const [cursorToUse, setCursorToUse] = useState<string>("")

  const loadReactions = useCallback(
    async (cursor: string = "") => {
      try {
        if (userFID) {
          setFetchingReactions(true)
          setErrorFetchingReactions(false)
          const reactionsResponse = await fetchCastReactionsForUser(
            userFID,
            cursor
          )
          setFetchingReactions(false)
          const reactions = reactionsResponse.reactions
          const newCursor: any = reactionsResponse.cursor
          setReactions(reactions)
          setCursorToUse(newCursor)
        }
      } catch (error) {
        setFetchingReactions(false)
        setErrorFetchingReactions(true)
        // console.error("Error fetching reactions:", error)
      }
    },
    [userFID]
  )

  useEffect(() => {
    loadReactions("")
  }, [loadReactions])

  return { reactions, cursorToUse, fetchingReactions, errorFetchingReactions }
}

export default useFetchReactionsForUser
