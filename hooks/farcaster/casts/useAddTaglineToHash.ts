"use client"

import { useEffect, useState } from "react"

import { addTaglinesToCasts } from "@/lib/helpers"
import { fetchTaglines } from "@/lib/requests"

const useAddTaglineToHash = (cast) => {
  const [castWithTagline, setCastWithTagline] = useState(cast)
  const [loadingCastWithTagline, setLoadingCastWithTagline] = useState(false)

  useEffect(() => {
    const fetchAndAddTaglineToCast = async () => {
      try {
        if (cast.hash) {
          const taglineWithHash = cast ? await fetchTaglines([cast]) : []
          const castWithTagline = cast
            ? addTaglinesToCasts([cast], taglineWithHash)
            : cast
          let enrichedCast = cast && castWithTagline ? castWithTagline[0] : cast
          setCastWithTagline(enrichedCast)
        }
      } catch (e) {}
    }
    fetchAndAddTaglineToCast()
  }, [])

  return {
    castWithTagline,
  }
}

export default useAddTaglineToHash
