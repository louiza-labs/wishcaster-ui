"use client"

import { useEffect, useState } from "react"
import { Cast } from "@/types"

import { categorizeCastsAsRequests, fetchFarcasterCast } from "@/app/actions"

interface ExtendedCast extends Cast {
  category?: string
}

const useGetCast = (castHash: string | undefined) => {
  const [fetchedCast, setFetchedCast] = useState<ExtendedCast | null>(null)

  const fetchAndSetCast = async () => {
    if (castHash && castHash.length) {
      const response = await fetchFarcasterCast(castHash)
      if (response) {
        const categorizedResponse = await categorizeCastsAsRequests([
          response as Cast,
        ])
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
