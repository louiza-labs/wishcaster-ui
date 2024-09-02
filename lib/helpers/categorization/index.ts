import { Cast as CastType, Category, NormalizedPostType } from "@/types"

import { PRODUCT_CATEGORIES_AS_MAP } from "@/lib/constants"
import { normalizeTweetText } from "@/lib/helpers"

export const searchPostsForCategories = (
  posts: NormalizedPostType[],
  searchTerm: string
): NormalizedPostType[] => {
  if (!posts || !Array.isArray(posts)) return []
  const searchTerms = searchTerm
    .toLowerCase()
    .split(",")
    .map((term) => term.trim())

  return posts.filter(
    (post) =>
      post.category &&
      searchTerms.some(
        (term) =>
          post.category &&
          post.category.id &&
          post.category.id.toLowerCase() === term
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

export function categorizeArrayOfPosts(posts: NormalizedPostType[]) {
  if (!posts || !Array.isArray(posts) || !posts[0]) return []

  let categorizedArray = posts.map((post: NormalizedPostType) => {
    const castText =
      post.platform === "farcaster" ? post.text : normalizeTweetText(post.text)
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
  Investors: [
    "investor",
    "investing",
    "portfolio",
    "finance",
    "trader",
    "equity",
    "stocks",
    "bonds",
    "venture capital",
    "angel investor",
    "hedge fund",
    "mutual funds",
    "cryptocurrency",
    "wealth management",
    "financial advisor",
    "investment banking",
  ],
  Developers: [
    "developer",
    "software",
    "programmer",
    "blockchain",
    "engineer",
    "coder",
    "dev",
    "frontend",
    "backend",
    "fullstack",
    "web developer",
    "app developer",
    "java",
    "python",
    "javascript",
    "c++",
    "ruby",
    "software architect",
    "machine learning",
    "AI",
    "devops",
    "cybersecurity",
  ],
  Enthusiasts: [
    "enthusiast",
    "fan",
    "lover",
    "aficionado",
    "buff",
    "hobbyist",
    "follower",
    "geek",
    "nerd",
    "amateur",
    "admirer",
    "supporter",
    "collector",
    "connoisseur",
    "devotee",
    "enthusiasm",
    "enthusiastic",
    "fanatic",
    "passion",
  ],
  ContentCreators: [
    "content",
    "creator",
    "artist",
    "youtuber",
    "influencer",
    "blogger",
    "vlogger",
    "streamer",
    "podcaster",
    "photographer",
    "videographer",
    "editor",
    "content producer",
    "social media",
    "storyteller",
    "brand ambassador",
    "creative director",
    "copywriter",
  ],
  Founder: [
    "entrepreneur",
    "startup",
    "founder",
    "business owner",
    "builder",
    "building",
    "co-founder",
    "CEO",
    "CFO",
    "COO",
    "venture",
    "startup founder",
    "small business",
    "innovator",
    "business leader",
    "business strategy",
    "self-employed",
    "company",
    "enterprise",
    "business development",
  ],
  Educators: [
    "educator",
    "teacher",
    "professor",
    "instructor",
    "trainer",
    "lecturer",
    "mentor",
    "tutor",
    "coach",
    "educational",
    "teaching",
    "faculty",
    "academic",
    "school",
    "university",
    "classroom",
    "curriculum",
    "education",
    "pedagogy",
    "learning",
    "educational consultant",
    "instructional designer",
  ],
  Marketers: [
    "marketer",
    "marketing",
    "advertising",
    "brand",
    "seo",
    "digital marketing",
    "social media marketing",
    "content marketing",
    "email marketing",
    "affiliate marketing",
    "market research",
    "public relations",
    "campaign",
    "marketing strategy",
    "advertiser",
    "branding",
    "product marketing",
    "customer engagement",
    "growth hacking",
  ],
  Analysts: [
    "analyst",
    "data",
    "research",
    "insight",
    "trend",
    "business analyst",
    "data analyst",
    "market analyst",
    "financial analyst",
    "data science",
    "quantitative analysis",
    "big data",
    "analytics",
    "forecasting",
    "data visualization",
    "data mining",
    "statistics",
    "researcher",
    "evaluation",
    "business intelligence",
  ],
  Designers: [
    "designer",
    "ux",
    "ui",
    "graphic",
    "creative",
    "web design",
    "product design",
    "interaction design",
    "visual design",
    "illustrator",
    "design thinking",
    "industrial design",
    "branding",
    "typography",
    "animation",
    "motion design",
    "creative director",
    "digital design",
    "user experience",
    "user interface",
  ],
  General: [
    "general",
    "audience",
    "viewer",
    "user",
    "participant",
    "community",
    "people",
    "customer",
    "client",
    "public",
    "visitor",
    "network",
    "subscriber",
    "supporter",
    "member",
    "guest",
    "follower",
    "consumer",
    "patron",
    "contributor",
  ], // Default segment for uncategorized users
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

function getBio(post: any) {
  if (post.object === "cast") {
    return post.author.profile.bio.text ?? ""
  } else {
    return post && post.user ? post.user.description : ""
  }
}

// Function to process posts and generate audience segments
export function generateAudienceSegments(posts: any[]): any[] {
  const segmentsMap: Record<string, any> = {}

  posts.forEach((post) => {
    // Extract bio from either the author or user field
    const bio = getBio(post)
    const segment = determineSegment(bio)
    if (segment === "General") {
      return // Skip the post if the segment is "General"
    }

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

export function categorizeAudienceByChannel(posts: any[]) {
  const segmentsMap: Record<string, any> = {}
  posts.forEach((post) => {
    const segment = post.object && post.object === "cast" ? "Farcaster" : "X"

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
