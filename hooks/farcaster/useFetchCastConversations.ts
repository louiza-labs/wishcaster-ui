"use client"

import { useCallback, useEffect, useState } from "react"
import { useNeynarContext } from "@neynar/react"

import { fetchCastConversation } from "@/app/actions"

export const useFetchCastConversations = (castHashes: string[]) => {
  const [conversations, setConversations] = useState<any[]>([])
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false)
  const [errorLoadingConversations, setErrorLoadingConversations] =
    useState<boolean>(false)

  const { user, isAuthenticated } = useNeynarContext()
  const loggedInUserFID = Number(user?.fid) ?? 0

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true)
      setErrorLoadingConversations(false)

      const conversationsAsArrays = await Promise.all(
        castHashes.map(async (castHash) => {
          const castsResponse = await fetchCastConversation(
            castHash,
            loggedInUserFID
          )
          return castsResponse.conversation
        })
      )
      const conversationsAsArrayOfObjects = conversationsAsArrays
        .filter((conversation) => conversation.length)
        .map((conversation) => {
          return {
            conversation: conversation,
          }
        })
      setConversations(conversationsAsArrayOfObjects)
      setLoadingConversations(false)
    } catch (error) {
      setLoadingConversations(false)
      setErrorLoadingConversations(true)
      console.error("Error fetching casts:", error)
    }
  }, [castHashes, loggedInUserFID])

  useEffect(() => {
    if (castHashes.length > 0) {
      loadConversations()
    }
  }, [loggedInUserFID, castHashes, loadConversations])

  return { conversations, loadingConversations, errorLoadingConversations }
}

export default useFetchCastConversations
