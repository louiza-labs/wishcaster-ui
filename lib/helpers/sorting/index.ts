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
      case "c":
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
