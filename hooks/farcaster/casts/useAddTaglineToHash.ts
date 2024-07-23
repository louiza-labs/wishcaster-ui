"use client"

import { useEffect, useState } from "react"

import { addTaglinesToCasts } from "@/lib/helpers"
import { fetchTaglines } from "@/lib/requests"

const useAddTaglineToHash = (post: any) => {
  const [castWithTagline, setCastWithTagline] = useState(post)
  const [loadingCastWithTagline, setLoadingCastWithTagline] = useState(false)

  useEffect(() => {
    const fetchAndAddTaglineToCast = async () => {
      try {
        if (post.hash) {
          const taglineWithHash = post ? await fetchTaglines([post]) : []
          const castWithTagline = post
            ? addTaglinesToCasts([post], taglineWithHash)
            : post
          let enrichedCast = post && castWithTagline ? castWithTagline[0] : post
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
