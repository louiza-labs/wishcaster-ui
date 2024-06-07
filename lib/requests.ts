import { Cast as CastType } from "@/types"

import { generateTaglinesForCasts } from "@/app/actions"

export async function fetchTaglines(casts: CastType[]) {
  try {
    const response = await generateTaglinesForCasts(casts)
    return response
  } catch (e) {
    console.error("the err fetching taglines", e)
    return []
  }
}
