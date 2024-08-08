import { summarizePosts, summarizePostsByIdea } from "../stats"

function calculateDemandScore(summary: any): number {
  const weights = {
    likes: 0.3,
    recasts: 0.25,
    replies: 0.2,
    impressions: 0.15,
    bookmarks: 0.1,
  }

  const totalEngagement =
    summary.likes * weights.likes +
    summary.recasts * weights.recasts +
    summary.replies * weights.replies +
    summary.impressions * weights.impressions +
    summary.bookmarks * weights.bookmarks

  const demandScore = totalEngagement / (summary.count || 1)

  return Math.min(Math.max(demandScore, 0), 1)
}
export function benchmarkAnalysis(
  userIdeaPosts: any[],
  similarIdeasPosts: Record<string, any[]>
): { name: string; demandScore: number }[] {
  const benchmarkData: { name: string; demandScore: number }[] = []

  // Calculate demand score for the user's idea
  const userSummary = summarizePosts(userIdeaPosts)
  const userIdeaScore = calculateDemandScore(userSummary)
  benchmarkData.push({ name: "Your Idea", demandScore: userIdeaScore })

  // Calculate demand scores for similar ideas
  for (const [ideaName, posts] of Object.entries(similarIdeasPosts)) {
    const summary = summarizePosts(posts)
    const demandScore = calculateDemandScore(summary)
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
  const benchmarkData: { name: string; demandScore: number }[] = []

  for (const [ideaName, summary] of Object.entries(summaries)) {
    const demandScore = calculateDemandScore(summary)
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
