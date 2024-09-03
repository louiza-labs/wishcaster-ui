"use client"

import { useEffect, useState } from "react"
import { Cast } from "@/types"

import { categorizeArrayOfPosts } from "@/lib/helpers"
import { fetchFarcasterCast } from "@/app/actions"

interface ExtendedCast extends Cast {
  category?: {
    label: string
    id: string
  }
}

const useGetCast = (castHash: string | undefined) => {
  const [fetchedCast, setFetchedCast] = useState<ExtendedCast | null>(null)

  const fetchAndSetCast = async () => {
    if (castHash && castHash.length) {
      const response = await fetchFarcasterCast(castHash)
      if (response) {
        const categorizedResponse = categorizeArrayOfPosts([response as any])
        if (
          categorizedResponse &&
          Array.isArray(categorizedResponse) &&
          categorizedResponse.length
        ) {
          const category = categorizedResponse[0]["category"]
          const extendedResponse = { ...response, category } as ExtendedCast
          setFetchedCast(extendedResponse)
        } else {
          setFetchedCast(response as ExtendedCast)
        }
      }
    }
  }

  useEffect(() => {
    if (!(fetchedCast && Object.keys(fetchedCast).length)) {
      fetchAndSetCast()
    }
  }, [castHash])

  return {
    fetchedCast,
  }
}

export default useGetCast
