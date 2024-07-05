"use client"

import { useCallback, useEffect, useState } from "react"
import { useNeynarContext } from "@neynar/react"

import { fetchCastConversation } from "@/app/actions"

export const useFetchCastConversation = (castHash: string) => {
  const [conversation, setConversation] = useState<any[]>([])
  const [loadingConversation, setLoadingConversation] = useState<boolean>(false)
  const [errorLoadingConversation, setErrorLoadingConversation] =
    useState<boolean>(false)

  const { user, isAuthenticated } = useNeynarContext()
  const loggedInUserFID = Number(user?.fid) ?? 0

  const loadCasts = useCallback(async () => {
    try {
      setLoadingConversation(true)
      setErrorLoadingConversation(false)

      const castsResponse = await fetchCastConversation(
        castHash,
        loggedInUserFID
      )
      const conversation = castsResponse.conversation
      setConversation(conversation)
      setLoadingConversation(false)
    } catch (error) {
      setLoadingConversation(false)
      setErrorLoadingConversation(true)
    }
  }, [])

  useEffect(() => {
    loadCasts()
  }, [loggedInUserFID, castHash])

  return { conversation, loadingConversation, errorLoadingConversation }
}

export default useFetchCastConversation
