import { Cast as CastType, Category } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import { normalizeTweetText } from "@/lib/helpers"

export const searchCastsForCategories = (
  casts: any[],
  searchTerm: string
): CastType[] => {
  if (!casts || !Array.isArray(casts)) return []
  const searchTerms = searchTerm
    .toLowerCase()
    .split(",")
    .map((term) => term.trim())

  return casts.filter(
    (cast) =>
      cast.category &&
      searchTerms.some(
        (term) =>
          cast.category &&
          cast.category.id &&
          cast.category.id.toLowerCase() === term
      )
  )
}

export const addCategoryFieldsToCasts = (
  casts: any[],
  categories: Category[]
) => {
  if (
    !categories ||
    (Array.isArray(categories) && !categories.length) ||
    !Array.isArray(categories)
  ) {
    return []
  }
  return casts.map((cast) => {
    let categoryMatch
    if (!(cast.object === "cast")) {
      let normalizedText = normalizeTweetText(cast.text)
      categoryMatch = categories.find(
        (category) => category.request === normalizedText
      )
    } else {
      categoryMatch = categories.find(
        (category) => category.request === cast.text
      )
    }
    return { ...cast, category: categoryMatch ? categoryMatch.category : null }
  })
}
export const addCategoryFieldsToTweets = (
  tweets: any[],
  categories: Category[]
) => {
  if (
    !categories ||
    (Array.isArray(categories) && !categories.length) ||
    !Array.isArray(categories)
  ) {
    return []
  }
  return tweets.map((tweet) => {
    let normalizedText = normalizeTweetText(tweet.text)
    const categoryMatch = categories.find(
      (category) => category.request === normalizedText
    )
    console.log("the tweet matches", categoryMatch)

    return { ...tweet, category: categoryMatch ? categoryMatch.category : null }
  })
}
interface CategoryDetails {
  label: string
  keywords: Set<string>
}

export function categorizeText(
  text: string,
  categories: { [key: string]: CategoryDetails }
): { label: string; id: string } | null {
  if (!text) {
    return null
  }

  // Normalize text and prepare for keyword matching
  const normalizedText = text.toLowerCase().trim()

  // Initialize a dictionary to keep count of keyword matches for each category
  const keywordCounts: { [category: string]: number } = {}

  // Iterate through each category and its keywords
  for (const [categoryId, categoryDetails] of Object.entries(categories)) {
    // Initialize count for the category
    keywordCounts[categoryId] = 0

    // Check for the presence of each keyword in the text using regex
    for (const keyword of categoryDetails.keywords) {
      // Use word boundary and global search for accurate counting
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      const matches = normalizedText.match(regex)
      if (matches) {
        keywordCounts[categoryId] += matches.length
      }
    }
  }

  // Find the category with the highest count of matching keywords
  let bestCategory: string | null = null
  let maxCount = 0
  for (const [categoryId, count] of Object.entries(keywordCounts)) {
    if (count > maxCount) {
      bestCategory = categoryId
      maxCount = count
    }
  }

  // If no matches were found, return null
  if (maxCount === 0 || bestCategory === null) {
    return null
  }

  // Return the label of the category with the highest count
  return { label: categories[bestCategory].label, id: bestCategory }
}

export function categorizeArrayOfCasts(casts: CastType[]) {
  if (!casts || !Array.isArray(casts) || !casts[0]) return []

  let categorizedArray = casts.map((cast: CastType) => {
    const castText =
      cast.object === "cast" ? cast.text : normalizeTweetText(cast.text)
    const category = categorizeText(castText, PRODUCT_CATEGORIES_AS_MAP)
    return {
      request: castText,
      category: category
        ? { label: category.label, id: category.id }
        : { label: null, id: null },
    }
  })
  return categorizedArray
}

export const filterCastsForCategory = (
  castsArray: CastType[],
  category: string
) => {
  if (!castsArray || !Array.isArray(castsArray) || !category) {
    return []
  }
  return castsArray.filter((cast: CastType) => cast.category?.id === category)
}
