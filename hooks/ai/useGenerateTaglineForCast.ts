import { useEffect, useState } from "react"
import { Cast as CastType } from "@/types"

import { fetchTaglines } from "@/lib/requests"

const useGenerateTaglineForCast = (cast: CastType, shouldGenerate: boolean) => {
  const [taglineForCast, setTaglineForCast] = useState("")

  const getAndSetTagline = async () => {
    if (shouldGenerate && cast) {
      const castsWithTaglines = await fetchTaglines([cast])
      if (castsWithTaglines && castsWithTaglines.length) {
        const tagline = castsWithTaglines[0].tagline
        if (tagline) {
          setTaglineForCast(tagline)
        }
      }
    }
  }
  useEffect(() => {
    if (shouldGenerate && taglineForCast && taglineForCast.length === 0) {
      getAndSetTagline()
    }
  }, [cast, taglineForCast, shouldGenerate])
  return {
    taglineForCast,
  }
}

export default useGenerateTaglineForCast
