import { useCallback, useEffect, useState } from "react"

import { fetchCastReactions } from "@/app/actions"

export const useFetchReactions = (castHash: string, castReactions: any) => {
  const [reactions, setReactions] = useState<any[]>([])
  const [cursorToUse, setCursorToUse] = useState<string>("")

  const loadReactions = useCallback(async () => {
    try {
      if (castHash && castHash.length) {
        const reactionsResponse = await fetchCastReactions(
          castHash,
          cursorToUse
        )
        const reactions = reactionsResponse.reactions
        const newCursor: any = reactionsResponse.cursor
        setReactions(reactions)
        setCursorToUse(newCursor)
      }
    } catch (error) {
      // console.error("Error fetching reactions:", error)
    }
  }, [])

  useEffect(() => {
    loadReactions()
  }, [castHash])

  return { reactions, cursorToUse }
}

export default useFetchReactions
