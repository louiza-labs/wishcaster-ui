import { NormalizedPostType } from "@/types"

export function formatAudienceData(audienceSegments: any, metricKey: any) {
  const metricHasDepth = metricKey.includes(".")
  const splitMetricKeyArr = metricKey.split(".")
  const metricKey1 = splitMetricKeyArr[0]
  const metricKey2 = splitMetricKeyArr[1]
  return audienceSegments.map((segment: any) => ({
    segmentName: segment.segmentName,
    value: metricHasDepth
      ? segment[metricKey1][metricKey2]
      : segment[metricKey],
  }))
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
export function generateAudienceSegments(posts: NormalizedPostType[]): any[] {
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
    segmentData.engagementStats.totalLikes += post.likesCount
    segmentData.engagementStats.totalRecasts += post.sharesCount
    segmentData.engagementStats.totalReplies += post.commentsCount

    segmentData.userCount += 1
    segmentData.postCount += 1
    segmentsMap[segment] = segmentData
  })

  return Object.values(segmentsMap)
}

interface PostSummary {
  likes: number
  priorityLikes: number
  recasts: number
  replies: number
  count: number
  impressions: number
  bookmarks: number
  totalFollowers: number
  averageFollowerCount: number
}

export function generateStatsForPosts(posts: NormalizedPostType[]): {
  overall: PostSummary
  farcaster: PostSummary
  twitter: PostSummary
} {
  const initialSummary: PostSummary = {
    likes: 0,
    priorityLikes: 0,
    recasts: 0,
    replies: 0,
    count: 0,
    impressions: 0,
    bookmarks: 0,
    totalFollowers: 0,
    averageFollowerCount: 0,
  }

  const summary = {
    overall: { ...initialSummary },
    farcaster: { ...initialSummary },
    twitter: { ...initialSummary },
  }

  posts.forEach((post) => {
    const targetSummary =
      post.object === "cast" ? summary.farcaster : summary.twitter

    summary.overall.likes += post.likesCount
    targetSummary.likes += post.likesCount

    summary.overall.recasts += post.sharesCount
    targetSummary.recasts += post.sharesCount

    summary.overall.replies += post.commentsCount
    targetSummary.replies += post.commentsCount

    summary.overall.bookmarks +=
      post.platform === "farcaster" ? 0 : post.additionalMetrics.bookmarkCount
    targetSummary.bookmarks +=
      post.platform === "farcaster" ? 0 : post.additionalMetrics.bookmarkCount

    summary.overall.impressions +=
      post.platform === "farcaster" ? 0 : post.additionalMetrics.impressionCount
    targetSummary.impressions +=
      post.platform === "farcaster" ? 0 : post.additionalMetrics.impressionCount

    summary.overall.count += 1
    targetSummary.count += 1

    summary.overall.totalFollowers +=
      post.platform === "farcaster" ? post.author.followerCount : 0
    targetSummary.totalFollowers +=
      post.platform === "farcaster" ? post.author.followerCount : 0
  })

  // Calculate the average follower count only if there are posts
  if (summary.overall.count > 0) {
    summary.overall.averageFollowerCount = Math.floor(
      summary.overall.totalFollowers / summary.overall.count
    )
  }

  if (summary.farcaster.count > 0) {
    summary.farcaster.averageFollowerCount = Math.floor(
      summary.farcaster.totalFollowers / summary.farcaster.count
    )
  }

  if (summary.twitter.count > 0) {
    summary.twitter.averageFollowerCount = Math.floor(
      summary.twitter.totalFollowers / summary.twitter.count
    )
  }

  return summary
}

function getMaxEngagementValues(posts: any[]): any {
  let maxLikes = 0
  let maxRecasts = 0
  let maxReplies = 0

  for (const post of posts) {
    if (post.likes > maxLikes) maxLikes = post.likes
    if (post.recasts > maxRecasts) maxRecasts = post.recasts
    if (post.replies > maxReplies) maxReplies = post.replies
  }

  return { likes: maxLikes, recasts: maxRecasts, replies: maxReplies }
}

function calculateDemandScore(summary: any, maxValues: any): number {
  const weights = {
    likes: 0.5,
    recasts: 0.3,
    replies: 0.2,
  }

  const totalEngagement =
    summary.likes * weights.likes +
    summary.recasts * weights.recasts +
    summary.replies * weights.replies

  const maxPossibleEngagement =
    maxValues.likes * weights.likes +
    maxValues.recasts * weights.recasts +
    maxValues.replies * weights.replies

  const demandScore = totalEngagement / (maxPossibleEngagement || 1)

  return Math.min(Math.max(demandScore, 0), 1)
}

/**
 * Summarizes engagement metrics for each idea.
 * @param posts - Array of posts, each associated with an idea.
 * @returns A map of idea names to their engagement summaries.
 */
export function summarizePostsByIdea(
  posts: NormalizedPostType[]
): Record<string, PostSummary> {
  const summaries: Record<string, PostSummary> | any = {}

  posts.forEach((post) => {
    if (post.idea) {
      const ideas = post.idea.split(", ").map((idea: any) => idea.trim())
      ideas.forEach((idea: any) => {
        if (!summaries[idea]) {
          summaries[idea] = {
            likes: 0,
            recasts: 0,
            replies: 0,
            impressions: 0,
            bookmarks: 0,
            count: 0,
            totalFollowers: 0,
            averageFollowerCount: 0,
          }
        }

        const summary = summaries[idea]
        const isFarcaster = post.platform === "farcaster"

        // Accumulate likes
        const likes = post.likesCount
        summary.likes += likes

        // Accumulate recasts/retweets
        const recasts = post.sharesCount
        summary.recasts += recasts

        // Accumulate replies
        const replies = post.commentsCount
        summary.replies += replies

        // Accumulate bookmarks and impressions (Twitter-specific)
        if (!isFarcaster) {
          summary.bookmarks += post.additionalMetrics?.bookmarkCount || 0
          summary.impressions += post.additionalMetrics?.impressionCount || 0
        }

        // Count the number of posts
        summary.count += 1

        // Accumulate total followers
        const followers = isFarcaster ? post.author?.followerCount || 0 : 0
        summary.totalFollowers += followers
      })
    }
  })

  // Calculate the average follower count for each idea
  Object.values(summaries).forEach((summary: any) => {
    if (summary.count > 0) {
      summary.averageFollowerCount = Math.floor(
        summary.totalFollowers / summary.count
      )
    }
  })

  return summaries
}

export function generateDemandScoreAndBenchmarkData(
  posts: NormalizedPostType[],
  userIdeaName: string
): {
  userDemandScore: number
  benchmarkData: { name: string; demandScore: number }[]
} {
  const summaries = summarizePostsByIdea(posts)

  const allPosts = Object.values(summaries).flat()
  const maxValues = getMaxEngagementValues(allPosts)

  const benchmarkData: { name: string; demandScore: number }[] = []

  for (const [ideaName, summary] of Object.entries(summaries)) {
    const demandScore = calculateDemandScore(summary, maxValues)
    benchmarkData.push({ name: ideaName, demandScore })

    // Highlight the user's idea in the benchmark data
    if (ideaName === userIdeaName) {
      benchmarkData.push({ name: `*${ideaName}*`, demandScore }) // Highlight the user's idea
    }
  }

  // Get the user's demand score
  const userDemandScore =
    benchmarkData.find((data) => data.name === userIdeaName)?.demandScore || 0

  // Sort the benchmark data for better visualization
  benchmarkData.sort((a, b) => b.demandScore - a.demandScore)

  return { userDemandScore, benchmarkData }
}
