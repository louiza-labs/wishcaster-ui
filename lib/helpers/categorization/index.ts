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
    !Array.isArray(categories) ||
    !Array.isArray(tweets)
  ) {
    return []
  }
  return tweets.map((tweet) => {
    let normalizedText = normalizeTweetText(tweet.text)
    const categoryMatch = categories.find(
      (category) => category.request === normalizedText
    )

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

const segmentKeywords = {
  Investors: ["investor", "investing", "portfolio", "finance", "trader"],
  Developers: [
    "developer",
    "software",
    "programmer",
    "blockchain",
    "engineer",
    "coder",
  ],
  Enthusiasts: ["enthusiast", "fan", "lover", "aficionado", "buff"],
  ContentCreators: [
    "content",
    "creator",
    "artist",
    "youtuber",
    "influencer",
    "blogger",
  ],
  Entrepreneurs: ["entrepreneur", "startup", "founder", "business owner"],
  Educators: ["educator", "teacher", "professor", "instructor", "trainer"],
  Marketers: ["marketer", "marketing", "advertising", "brand", "seo"],
  Analysts: ["analyst", "data", "research", "insight", "trend"],
  Designers: ["designer", "ux", "ui", "graphic", "creative"],
  General: [], // Default segment for uncategorized users
}

// Function to determine the audience segment from bio
function determineSegment(bio: string): string {
  for (const [segment, keywords] of Object.entries(segmentKeywords)) {
    if (keywords.some((keyword) => bio.toLowerCase().includes(keyword))) {
      return segment
    }
  }
  return "General"
}

// Function to process posts and generate audience segments
export function generateAudienceSegments(posts: any[]): any[] {
  const segmentsMap: Record<string, any> = {}

  posts.forEach((post) => {
    // Extract bio from either the author or user field
    const bio = post.author?.bio || post.user?.description || ""
    const segment = determineSegment(bio)
    const segmentData = segmentsMap[segment] || {
      segmentName: segment,
      engagementStats: {
        totalLikes: 0,
        totalRecasts: 0,
        totalReplies: 0,
      },
      userCount: 0,
      postCount: 0,
    }

    // Aggregate engagement stats
    if (post.reactions) {
      segmentData.engagementStats.totalLikes += post.reactions.likes_count
      segmentData.engagementStats.totalRecasts += post.reactions.recasts_count
      segmentData.engagementStats.totalReplies += post.replies?.count || 0
    } else if (post.public_metrics) {
      segmentData.engagementStats.totalLikes += post.public_metrics.like_count
      segmentData.engagementStats.totalRecasts +=
        post.public_metrics.retweet_count
      segmentData.engagementStats.totalReplies +=
        post.public_metrics.reply_count
    }

    segmentData.userCount += 1
    segmentData.postCount += 1
    segmentsMap[segment] = segmentData
  })

  return Object.values(segmentsMap)
}
