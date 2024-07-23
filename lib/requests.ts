"use server"

import { generateTaglinesForCasts } from "@/app/actions"

export async function fetchTaglines(casts: any[], batchSize = 10) {
  const batchedResults = []
  const batches = []

  // Split casts into smaller batches
  for (let i = 0; i < casts.length; i += batchSize) {
    const batch = casts.slice(i, i + batchSize)
    batches.push(batch)
  }

  try {
    // Process each batch
    for (const batch of batches) {
      const response = await generateTaglinesForCasts(batch)
      batchedResults.push(...response)
    }
  } catch (e) {
    // console.error("Error fetching taglines:", e)
    return []
  }

  return batchedResults
}
