import { summarizePosts, summarizePostsByIdea } from "../stats"

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

function getMaxEngagementValues(posts: any[]): any {
  let maxLikes = 0
  let maxRecasts = 0
  let maxReplies = 0

  for (const post of posts) {
    if (post.likesCount > maxLikes) maxLikes = post.likes
    if (post.sharesCount > maxRecasts) maxRecasts = post.recasts
    if (post.commentsCount > maxReplies) maxReplies = post.replies
  }

  return { likes: maxLikes, recasts: maxRecasts, replies: maxReplies }
}

export function benchmarkAnalysis(
  userIdeaPosts: any[],
  similarIdeasPosts: Record<string, any[]>
): { name: string; demandScore: number }[] {
  const allPosts = [
    ...userIdeaPosts,
    ...Object.values(similarIdeasPosts).flat(),
  ]
  const maxValues = getMaxEngagementValues(allPosts)

  const benchmarkData: { name: string; demandScore: number }[] = []

  // Calculate demand score for the user's idea
  const userSummary = summarizePosts(userIdeaPosts)

  const userIdeaScore = calculateDemandScore(userSummary, maxValues)
  benchmarkData.push({ name: "Your Idea", demandScore: userIdeaScore })

  // Calculate demand scores for similar ideas
  for (const [ideaName, posts] of Object.entries(similarIdeasPosts)) {
    const summary = summarizePosts(posts)
    const demandScore = calculateDemandScore(summary, maxValues)
    benchmarkData.push({ name: ideaName, demandScore })
  }

  // Sort the data for better visualization
  benchmarkData.sort((a, b) => b.demandScore - a.demandScore)

  return benchmarkData
}

export function prepareVisualizationData(
  posts: any[],
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
