import { Cast as CastType } from "@/types"

export function sortCastsByProperty(
  casts: any[],
  sortField: "recent" | "replies" | string
): CastType[] {
  // Create a shallow copy of the array to sort, to avoid modifying the original array
  const sortedCasts = [...casts]
  // Sort the copied array
  sortedCasts.sort((a, b) => {
    let valueA: number | string
    let valueB: number | string

    switch (sortField) {
      case "recent":
        // Sort by timestamp in descending order
        valueA = a.object === "cast" ? a.timestamp : a.created_at
        valueB = b.object === "cast" ? b.timestamp : b.created_at
        break
      case "replies":
        // Sort by replies count
        valueA =
          a.object === "cast" ? a.replies.count : a.public_metrics.reply_count
        valueB =
          b.object === "cast" ? b.replies.count : b.public_metrics.reply_count
        break
      case "likes_count":
        valueA =
          a.object === "cast" ? a.reactions.likes : a.public_metrics.like_count
        valueB =
          b.object === "cast" ? b.reactions.likes : b.public_metrics.like_count
        break
      case "recasts_count":
        valueA =
          a.object === "cast"
            ? a.reactions.recasts
            : a.public_metrics.retweet_count
        valueB =
          b.object === "cast"
            ? b.reactions.recasts
            : b.public_metrics.retweet_count
        break
      case "bookmarks":
        valueA =
          a.object === "cast"
            ? a.reactions.recasts
            : a.public_metrics.bookmark_count
        valueB =
          b.object === "cast"
            ? b.reactions.recasts
            : b.public_metrics.bookmark_count
        break
      case "impressions":
        valueA =
          a.object === "cast"
            ? a.reactions.recasts
            : a.public_metrics.impression_count
        valueB =
          b.object === "cast"
            ? b.reactions.recasts
            : b.public_metrics.impression_count
        break
      default:
        let reactionsA: any = a.reactions
        let reactionsB: any = b.reactions
        // Sort by specified reaction type, ensure it exists or default to zero
        valueA = reactionsA[sortField] ?? 0
        valueB = reactionsB[sortField] ?? 0
    }

    // Return negative, zero, or positive based on the comparison for descending order
    return Number(valueB) - Number(valueA)
  })

  return sortedCasts
}

type UserRankings = {
  user: string
  rankings: {
    likes_count: number
    recasts_count: number
    replies_count: number
    impression_count: number
    bookmark_count: number
    count: number
  }
  userDetails: any
}

export function getTopUsersByMetric(
  userRankings: UserRankings[],
  metric: string,
  topX: number
): UserRankings[] {
  // Validate the metric
  const validMetrics = [
    "likes_count",
    "recasts_count",
    "replies_count",
    "impression_count",
    "bookmark_count",
    "count",
  ]
  if (!validMetrics.includes(metric)) {
    throw new Error(
      `Invalid metric: ${metric}. Valid metrics are: ${validMetrics.join(", ")}`
    )
  }

  // Sort users by the specified metric
  const sortedUsers = userRankings.sort(
    (a: any, b: any) => a.rankings[metric] - b.rankings[metric]
  )

  // Return the top X users
  return sortedUsers.slice(0, topX)
}

// Example usage
