import { Cast as CastType } from "@/types"

export function sortCastsByProperty(
  casts: CastType[],
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
        valueA = a.timestamp
        valueB = b.timestamp
        break
      case "replies":
        // Sort by replies count
        valueA = a.replies.count
        valueB = b.replies.count
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
